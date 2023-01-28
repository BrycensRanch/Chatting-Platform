import Fastify from 'fastify';
import { test } from 'tap';

// eslint-disable-next-line import/extensions
import Sensible from '../../plugins/sensible';

test('sensible works standalone', async (t) => {
  const fastify = Fastify();

  void fastify.register(Sensible);
  await fastify.ready();
  // @ts-ignore
  t.throws(fastify.httpErrors.notFound(), fastify.httpErrors.notFound);
});
