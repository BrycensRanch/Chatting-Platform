import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(async (err, _req, reply) => {
    reply.status(500);
    // @ts-ignore
    fastify.Sentry.captureException(err);
    return reply.send(err);
  });
});
