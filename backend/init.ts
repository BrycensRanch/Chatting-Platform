/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import type { AutoloadPluginOptions } from '@fastify/autoload';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
// import inputValidation from 'openapi-validator-middleware';
import fs from 'fs';
// Trust me bro, I have no idea what this code is doing... However, it allows the import of ESM modules so I'm not complaining.
// @ts-ignore
// eslint-disable-next-line import/extensions
import inclusion from 'inclusion';
// eslint-disable-next-line import/no-named-default
import { default as Redis } from 'ioredis';
import { join } from 'path';
import type { Server } from 'socket.io';

require('dotenv').config();

export type AppOptions = {
  // // Place your custom options for app below here.
  // https: {
  //   key: string;
  //   cert: string;
  // };
  // https: boolean;
  logger: {};
  prefix: string;
} & Partial<AutoloadPluginOptions>;
// Application SSL, for Nginx to use to ensure that this Fastify instance is trusted.
// This SSL shouldn't effect clients though. That's NGINX's job. It'll use Cloudflare SSL instead.
const SSLFolder = './ssl';
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  // https: true,
  // https: {
  //   key: path.join(SSLFolder, 'key.pem'),
  //   cert: path.join(SSLFolder, 'certificate.pem'),
  // },
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
  prefix: 'hi',
};
if (!fs.existsSync(SSLFolder)) {
  fs.mkdirSync(SSLFolder, { recursive: true });
}

const fastify: FastifyPluginAsync<AppOptions> = async (
  app,
  _opts
): Promise<void> => {
  // Let's not run this while testing/prod... It's done repeatedly and it's very very annoying.
  if (
    process.env.NODE_APP_INSTANCE === '0' ||
    (!process.env.NODE_APP_INSTANCE && process.env.NODE_ENV !== 'test')
  ) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const printRoutes: typeof import('fastify-print-routes')['default'] = (
      await inclusion('fastify-print-routes')
    ).default;
    await app.register(printRoutes);
  }

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });
  await app.register(cors, {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
  });
  // Create a Redis instance.
  // By default, it will connect to localhost:6379.
  // We are going to cover how to specify connection options soon.
  // Connecting to any database is a blocking operation
  const redis = new Redis({
    host: 'host.docker.internal',
    port: 6379,
    password: process.env.REDIS_PASSWORD || process.env.REDIS_PWD,
    family: 4, // 4 (IPv4) or 6 (IPv6)
  });
  app
    .decorate('redis', redis)
    .decorateRequest('redis', { getter: () => app.redis })
    .addHook('onClose', async (app, done) => {
      app.redis.disconnect();
      done();
    });
  const prisma = new PrismaClient();

  app
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => app.prisma })
    .addHook('onClose', async (app, done) => {
      await app.prisma.$disconnect();
      done();
    });
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void app.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void app.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
  });
  const healthCheckConfig = {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization: 0.98,
    message: 'The robots have taken over! Our server pooped itself.',
    retryAfter: 500,
    healthCheckInterval: 500,
    healthCheck: async (fastifyInstance: FastifyInstance) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (await fastifyInstance.redis.ping()) === 'PONG';
      } catch (_e) {
        return false;
      }
      try {
        await fastifyInstance.prisma.$queryRaw`SELECT 1`;
      } catch (_e) {
        return false;
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        return true;
      }
    },
  };
  if (process.env.NODE_ENV !== 'test') {
    // More in depth health check of our DB and Cache.
    await app.register(require('@fastify/under-pressure'), healthCheckConfig);
  }
  /*
Since fastify-print-routes uses an onRoute hook, you have to either:

* use `await register...`
* wrap you routes definitions in a plugin

See: https://www.fastify.io/docs/latest/Guides/Migration-Guide-V4/#synchronous-route-definitions
*/
  // This is my first time using ESM modules. I'm so proud of myself.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  // const importDynamic = new Function(
  //   'fastify-print-routes',
  //   "return import('fastify-print-routes')"
  // );
};
// Are we running under PM2 or similar?
if (process.env.NODE_APP_INSTANCE) {
  // @ts-ignore
  process.send('ready');
}
export default fastify;
export { fastify, options };
// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string;
    prisma: PrismaClient;
    redis: Redis;
    io: Server;
  }
}
