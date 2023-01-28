/* eslint-disable no-console */
import { fastify } from 'fastify';

import * as app from './init';

const start = async () => {
  const server = fastify();
  await server.register(app.fastify);
  // @ts-ignore
  server.listen(
    { port: process.env.PORT || process.env.FASTIFY_PORT || '8000' },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    }
  );
};
start();
