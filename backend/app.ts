/* eslint-disable no-console */
import { fastify } from 'fastify';

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
