/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import type { AutoloadPluginOptions } from '@fastify/autoload';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import formDataPlugin from '@fastify/formbody';
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
import supertokens from 'supertokens-node';
import { errorHandler } from 'supertokens-node/framework/fastify';
import Dashboard from 'supertokens-node/recipe/dashboard';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyPasswordless, {
  Apple,
  Github,
  Google,
} from 'supertokens-node/recipe/thirdpartypasswordless';

require('dotenv').config();

export type AppOptions = {
  // // Place your custom options for app below here.
  // https: {
  //   key: string;
  //   cert: string;
  // };
  // https: boolean;
  logger: boolean;
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
  logger: true,
  prefix: 'hi',
};
if (!fs.existsSync(SSLFolder)) {
  fs.mkdirSync(SSLFolder, { recursive: true });
}
supertokens.init({
  framework: 'fastify',
  supertokens: {
    connectionURI: `http://localhost:3567`,
    // apiKey: "someKey" // OR can be undefined
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: 'ChatPlatform',
    apiDomain: `http://localhost:8000`,
    websiteDomain: `http://localhost:3000`,
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    ThirdPartyPasswordless.init({
      flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
      contactMethod: 'EMAIL',
      providers: [
        // We have provided you with development keys which you can use for testing.
        // IMPORTANT: Please replace them with your own OAuth keys for production use.
        Google({
          clientId:
            '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
          clientSecret: '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',
        }),
        Github({
          clientId: '467101b197249757c71f',
          clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
        }),
        Apple({
          clientId: '4398792-io.supertokens.example.service',
          clientSecret: {
            keyId: '7M48Y4RYDL',
            privateKey:
              '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
            teamId: 'YWQCXGJRJL',
          },
        }),
        // Facebook({
        //     clientSecret: "FACEBOOK_CLIENT_SECRET",
        //     clientId: "FACEBOOK_CLIENT_ID"
        // })
      ],
    }),
    Session.init({
      // sessionScope: ".example.com"
    }), // initializes session features
    Dashboard.init({
      apiKey: 'B84i@WH7b9Cj9jzRvk^cJ', // I love committing numerous secrets to Github
    }),
  ],
});
const fastify: FastifyPluginAsync<AppOptions> = async (
  app,
  _opts
): Promise<void> => {
  // Let's not run this while testing/prod... It's done repeatedly and it's very very annoying.
  if (
    process.env.NODE_ENV !== 'test' &&
    process.env.NODE_ENV !== 'production'
  ) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const printRoutes: typeof import('fastify-print-routes')['default'] = (
      await inclusion('fastify-print-routes')
    ).default;
    await app.register(printRoutes);
  }
  app.setErrorHandler(errorHandler());

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });
  await app.register(cors, {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
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
  await app.register(formDataPlugin);
  const healthCheckConfig = {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization: 0.98,
    message: 'The robots have taken over! Our server pooped itself.',
    retryAfter: 500,
  };

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-sequences
  (healthCheckConfig.healthCheckInterval = process.env.DEBUG ? 30000 : 500),
    // @ts-ignore
    (healthCheckConfig.healthCheck = async (
      fastifyInstance: FastifyInstance
    ) => {
      try {
        await fastifyInstance.prisma.$queryRaw`SELECT 1`;
      } catch (_e) {
        return false;
      }
      try {
        return (await fastifyInstance.redis.ping()) === 'PONG';
      } catch (_e) {
        return false;
      }
    });

  // More in depth health check of our DB and Cache.
  await app.register(require('@fastify/under-pressure'), healthCheckConfig);
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
  }
}
