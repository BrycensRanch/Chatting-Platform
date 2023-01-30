/* eslint-disable no-console */
import { createAdapter } from '@socket.io/redis-adapter';
import { fastify } from 'fastify';
import Redis from 'ioredis';

import * as app from './init';

const start = async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const scanEnv = require('scan-env');

  const scanResult = scanEnv();

  if (scanResult.length) {
    console.error(
      `The following required environment variables are missing: ${scanResult.join(
        ', '
      )}`
    );
  }
  const server = fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    },
    trustProxy: true,
  });
  await server.register(app.fastify);
  let good = false;
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const eiows = require('eiows');
    good = true;
  } catch (e) {
    console.error('no eiows installed');
  }
  const socketIOOptions: any = {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: [],
    },
    logLevel: 'info',
    allowEIO3: true, // false by default
  };

  if (good) socketIOOptions.wsEngine = require('eiows').Server;
  server.decorate('io', require('socket.io')(server.server, socketIOOptions));
  server.addHook('onClose', (fastify, done) => {
    fastify.io.close();
    done();
  });
  const redis = new Redis({
    host: 'host.docker.internal',
    port: 6379,
    password: process.env.REDIS_PASSWORD || process.env.REDIS_PWD,
    family: 4, // 4 (IPv4) or 6 (IPv6)
  });
  await server.ready();
  const subClient = redis.duplicate();
  server.io.adapter(createAdapter(redis, subClient));

  server.io.of('/').adapter.on('create-room', (room) => {
    console.log(`room ${room} was created`);
  });

  server.io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });
  server.io.sockets.on('connection', async function handleSocket(socket) {
    /**
     * Log actions to the client
     */
    function log(...args: string[]) {
      const array = ['Server:'];
      array.push.apply(array, args);
      socket.emit('log', array);
      console.log(args);
    }
    /**
     * Handle message from a client
     * If toId is provided message will be sent ONLY to the client with that id
     * If toId is NOT provided and room IS provided message will be broadcast to that room
     * If NONE is provided message will be sent to all clients
     */
    socket.on('message', (rawMessage: any, toId = null, room = null) => {
      let message;
      try {
        message = JSON.parse(rawMessage);
      } catch (e) {
        console.error('client sent raw message that isnt json');
      }
      if (!message) message = rawMessage;
      log(`Client ${socket.id} said: `, message);

      if (toId) {
        console.log('From ', socket.id, ' to ', toId, message);

        server.io.to(toId).emit('message', message, socket.id);
      } else if (room) {
        console.log('From ', socket.id, ' to room: ', room, message);

        socket.broadcast.to(room).emit('message', message, socket.id);
      } else {
        console.log('From ', socket.id, ' to everyone ', message);

        socket.broadcast.emit('message', message, socket.id);
      }
    });

    let roomAdmin: string; // save admins socket id (will get overwritten if new room gets created)
    // Triggered when a peer hits the join room button.
    socket.on('join', (roomName: string) => {
      const { rooms } = server.io.sockets.adapter;
      console.log(rooms);
      const room = rooms.get(roomName);

      // room == undefined when no such room exists.
      if (room === undefined) {
        socket.join(roomName);
        socket.emit('created');
      } else if (room.size === 1) {
        // room.size == 1 when one person is inside the room.
        socket.join(roomName);
        socket.emit('joined');
      } else {
        // when there are already two people inside the room.
        socket.emit('full');
      }
    });

    // Triggered when the person who joined the room is ready to communicate.
    socket.on('ready', (roomName: string) => {
      socket.broadcast.to(roomName).emit('ready'); // Informs the other peer in the room.
    });

    // Triggered when server gets an icecandidate from a peer in the room.
    socket.on(
      'ice-candidate',
      (candidate: RTCIceCandidate, roomName: string) => {
        console.log(candidate);
        socket.broadcast.to(roomName).emit('ice-candidate', candidate); // Sends Candidate to the other peer in the room.
      }
    );

    // Triggered when server gets an offer from a peer in the room.
    socket.on('offer', (offer: any, roomName: string) => {
      socket.broadcast.to(roomName).emit('offer', offer); // Sends Offer to the other peer in the room.
    });

    // Triggered when server gets an answer from a peer in the room.
    socket.on('answer', (answer: any, roomName: string) => {
      socket.broadcast.to(roomName).emit('answer', answer); // Sends Answer to the other peer in the room.
    });

    socket.on('leave', (roomName: string) => {
      socket.leave(roomName);
      socket.broadcast.to(roomName).emit('leave');
    });
    /**
     * Kick participant from a call
     */
    socket.on('kick', (socketId: string, roomName: string) => {
      if (socket.id === roomAdmin) {
        socket.broadcast.emit('kickout', socketId);
        console.log(server.io.sockets.sockets);
        // server.io.sockets.sockets.get(socketId).leave(room);
      } else {
        console.log('not an admin');
      }
    });
  });
  // @ts-ignore
  server.listen(
    {
      port: process.env.PORT || process.env.FASTIFY_PORT || '8000',
      host: '::',
    },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      if (
        process.env.NODE_APP_INSTANCE === '0' ||
        (!process.env.NODE_APP_INSTANCE && process.env.NODE_ENV !== 'test')
      ) {
        console.log(`Server listening at ${address}`);
      }
    }
  );
};
start();
