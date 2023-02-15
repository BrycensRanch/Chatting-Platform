/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import type { AutoloadPluginOptions } from '@fastify/autoload';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { FastifyPluginAsync } from 'fastify';
// import inputValidation from 'openapi-validator-middleware';
import fs from 'fs';
// Trust me bro, I have no idea what this code is doing... However, it allows the import of ESM modules so I'm not complaining.
// @ts-ignore
// eslint-disable-next-line import/extensions
import inclusion from 'inclusion';
// eslint-disable-next-line import/no-named-default
import { join } from 'path';

import { frontendServerURL } from './constants';

require('dotenv-expand').expand(require('dotenv-mono').load());

require('dotenv-expand').expand(
  require(`dotenv-defaults`).config({
    path: './.env',
    encoding: 'utf8',
    defaults: './.env.example', // This is new
  })
);

export type AppOptions = {
  // // Place your custom options for app below here.
  // https: {
  //   key: string;
  //   cert: string;
  // };
  // https: boolean;
  logger: {};
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
    origin: [frontendServerURL, 'https://www.piesocket.com'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
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
  /*
Since fastify-print-routes uses an onRoute hook, you have to either:

* use `await register...`
* wrap you routes definitions in a plugin

See: https://www.fastify.io/docs/latest/Guides/Migration-Guide-V4/#synchronous-route-definitions
*/
};
// Are we running under PM2 or similar?
if (process.env.NODE_APP_INSTANCE) {
  // @ts-ignore
  process.send('ready');
}
export default fastify;
export { fastify, options };
