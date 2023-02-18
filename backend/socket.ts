/* eslint-disable no-console */
import { readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { createAdapter } from '@socket.io/redis-adapter';
import type { FastifyInstance } from 'fastify';
import Redis from 'ioredis';

const deepReadDir = async (dirPath) =>
  Promise.all(
    (await readdir(dirPath, { withFileTypes: true })).map(async (dirent) => {
      const path = join(dirPath, dirent.name);
      return dirent.isDirectory() ? deepReadDir(path) : path;
    })
  );

const socketAPI = async (server: FastifyInstance) => {
  let redis: Redis;
  if (
    process.env.GIT_PROXY?.includes('stackblitz') ||
    process.env.NODE_ENV === 'test'
  ) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { default: Redis } = await import('ioredis-mock');
    redis = new Redis();
  } else {
    redis = new Redis(
      process.env.REDIS_URL?.replace(
        // eslint-disable-next-line no-template-curly-in-string
        '${REDIS_PASSWORD}',
        process.env.REDIS_PASSWORD as string
      ) as string
    );
  }

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
  io.fastify = server;

  if (!process.env.NODE_APP_INSTANCE) {
    let subClient;
    try {
      subClient = redis.duplicate();
    } catch (e) {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { default: RedisMock } = await import('ioredis-mock');
      const { setupMaster } = require('@socket.io/sticky');
      setupMaster(io);
      subClient = new RedisMock();
      io.fastify.log.error(
        `Guessing this is an testing environment without Redis...`
      );
      io.fastify.log.error('Using in memory adapter instead of Redis adapter.');
    }
    if (subClient) io.adapter(createAdapter(redis, subClient));
  } else {
    const {
      createAdapter: createClusterAdapter,
    } = require('@socket.io/cluster-adapter');
    const { setupWorker } = require('@socket.io/sticky');
    io.adapter(createClusterAdapter());
    setupWorker(io);
  }

  io.sockets.on('connection', async (socket) => {
    const socketEvents = (await deepReadDir('sockets')).flat(
      Number.POSITIVE_INFINITY
    );
    socketEvents.forEach(async (socketEvent) => {
      const eventName = basename(
        socketEvent.split('/').pop().split('.').shift()
      );
      const event = await import(join(__dirname, socketEvent));

      server.log.info(`Socket event ${eventName} loaded.`);
      socket.on(eventName, await event.default.bind(null, socket, io));
    });
  });
};
declare module 'socket.io' {
  interface Server {
    fastify: FastifyInstance;
  }
}
export default socketAPI;
