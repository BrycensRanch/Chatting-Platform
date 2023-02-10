/* eslint-disable no-console */
import { createAdapter } from '@socket.io/redis-adapter';
import { fastify } from 'fastify';
import Redis from 'ioredis';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as app from './init';

const start = async () => {
  try {
    const scanEnv = require('scan-env');

    const scanResult = scanEnv();

    if (scanResult.length) {
      console.error(
        `The following required environment variables are missing: ${scanResult.join(
          ', '
        )}`
      );
    }
  } catch (e) {
    console.error(
      'failed to check if environment variables are missing, likely due to a missing .env.example'
    );
  }

  console.log(process.env);
  const server = fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
      },
    },
    trustProxy:
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
  });
  await server.register(app.fastify);
  const redis = new Redis(
    process.env.REDIS_URL?.replace(
      // eslint-disable-next-line no-template-curly-in-string
      '${REDIS_PASSWORD}',
      process.env.REDIS_PASSWORD as string
    ) as string
  );

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

        const socketIOOptions = {
          cors: {
            origin: [
              process.env.FRONTEND_SERVER || 'http://localhost:3000',
              'https://www.piesocket.com', // testing
            ],
            methods: ['GET', 'POST'],
            credentials: true,
          },
          logLevel: 'info',
          allowEIO3: true, // false by default
          cookie: {
            name: 'socket',
            httpOnly: false,
            secure: true,
            sameSite: 'none',
          },
        };

        // if (good) socketIOOptions.wsEngine = require('eiows').Server;
        const io = require('socket.io')(server.server, socketIOOptions);

        if (!process.env.NODE_APP_INSTANCE) {
          const subClient = redis.duplicate();
          io.adapter(createAdapter(redis, subClient));
        } else {
          const {
            createAdapter: createClusterAdapter,
          } = require('@socket.io/cluster-adapter');
          const { setupWorker } = require('@socket.io/sticky');
          io.adapter(createClusterAdapter());
          setupWorker(io);
        }

        io.sockets.on('connection', async function handleSocket(socket) {
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
            if (message.length > 2000) return; // this feature requires discord nitro :)
            if (toId) {
              console.log('From ', socket.id, ' to ', toId, message);

              io.to(toId).emit('message', message, socket.id);
            } else if (room) {
              console.log('From ', socket.id, ' to room: ', room, message);

              socket.broadcast.to(room).emit('message', message, socket.id);
            } else {
              console.log('From ', socket.id, ' to everyone ', message);

              socket.broadcast.emit('message', message, socket.id);
            }
          });

          // Triggered when a peer hits the join room button.
          socket.on('join', async (roomName: string) => {
            const { rooms } = io.sockets.adapter;
            const room = rooms.get(roomName);
            if (roomName.length > 50) return;

            // room == undefined when no such room exists.
            if (room === undefined) {
              socket.join(roomName);
              socket.emit('created');
            } else if (room.size === 1) {
              // room.size == 1 when one person is inside the room.

              socket.join(roomName);
              const rawRooms = Array.from(io.of('/').adapter.rooms);
              const room = rawRooms
                .map((r: any) => {
                  return {
                    name: r[0],
                    sockets: Array.from(r[1]),
                  };
                })
                .find((r) => r.name === roomName);
              socket.emit('joined', room);
              const hostSocket = room?.sockets[0];
              console.log(
                `room admin of ${roomName} is now connected (${hostSocket})`
              );
            } else {
              // when there are already two people inside the room.
              socket.emit('full');
            }
          });

          // Triggered when the person who joined the room is ready to communicate.
          socket.on('ready', (roomName: string) => {
            socket.broadcast.to(roomName).emit('ready', socket.id); // Informs the other peer in the room.
          });
          socket.on('video', (webcamActive: boolean, roomName: string) => {
            socket.broadcast
              .to(roomName)
              .emit(
                'message',
                `socket ${socket.id} ${
                  webcamActive ? 'enabled' : 'disabled'
                } their camera/screen`
              ); // Informs the other peer in the room.
          });
          socket.on('audio', (micActive: boolean, roomName: string) => {
            socket.broadcast
              .to(roomName)
              .emit(
                'message',
                `socket ${socket.id} ${
                  micActive ? 'enabled' : 'disabled'
                } their mic/audio`
              ); // Informs the other peer in the room.
          });
          // Triggered on homepage
          socket.on('get-rooms', () => {
            const rawRooms = Array.from(io.of('/').adapter.rooms);
            const rooms = rawRooms.map((r: any) => {
              return {
                name: r[0],
                sockets: Array.from(r[1]),
              };
            });
            socket.emit('rooms', rooms);
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
            const hostSocketId = Array.from(
              io.of('/').adapter.rooms.get(roomName)
            )[0];
            console.log(
              `host socket id ${hostSocketId} kicked ${socketId} from room ${roomName}`
            );
            if (hostSocketId !== socketId) {
              console.log('valid kick');
              socket.broadcast.to(roomName).emit('kickout', socketId);
            }
            // const hostSocket = sockets.values().next().value;
            // if (socket.id === hostSocket?.id) {
            //   socket.broadcast.emit('kickout', socketId);
            //   console.log(io.sockets.sockets);
            //   // io.sockets.sockets.get(socketId).leave(room);
            // } else {
            //   console.log('not an admin');
            // }
          });
        });
      }
    }
  );
};
start();
