import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import inputValidation from 'openapi-validator-middleware';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(async (err, _req, reply) => {
    if (err instanceof inputValidation.InputValidationError) {
      return reply.status(400).send({ more_info: JSON.stringify(err.errors) });
    }

    reply.status(500);
    // @ts-ignore
    fastify.Sentry.captureException(err);
    return reply.send(err);
  });
});
