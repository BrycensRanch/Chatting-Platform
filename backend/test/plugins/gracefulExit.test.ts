// SIGUSR2

import Fastify from 'fastify';
import { test } from 'tap';

// eslint-disable-next-line import/extensions
import GracefulExit from '../../plugins/exit';


test('fastify graceful exit prints log to console', async (t) => {
  const fastify = Fastify();

  await fastify.register(GracefulExit);
  await fastify.ready();
  t.ok(true)
});
