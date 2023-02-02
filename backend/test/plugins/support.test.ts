import Fastify from 'fastify';
import { test } from 'tap';

// eslint-disable-next-line import/extensions
import Support from '../../plugins/support';

test('support works standalone', async (t) => {
  const fastify = Fastify();
  void fastify.register(Support);
  await fastify.ready();
  t.equal(fastify.someSupport(), 'hugs');
});

// You can also use plugin with opts in fastify v2
//
// test('support works standalone', (t) => {
//   t.plan(2)
//   const fastify = Fastify()
//   fastify.register(Support)
//
//   fastify.ready((err) => {
//     t.error(err)
//     t.equal(fastify.someSupport(), 'hugs')
//   })
// })
