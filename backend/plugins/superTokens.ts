import fp from 'fastify-plugin';
import { plugin } from 'supertokens-node/framework/fastify';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify) => {
  fastify.register(plugin);
});
