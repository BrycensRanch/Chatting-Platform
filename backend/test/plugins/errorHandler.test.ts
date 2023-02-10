import Fastify from 'fastify';
import { test } from 'tap';

// eslint-disable-next-line import/extensions
import ErrorHandler from '../../plugins/errorHandler';


test('error handler works standalone', async (t) => {
  const fastify = Fastify();

  await fastify.register(ErrorHandler);
  await fastify.ready();
  t.ok(true)
});
