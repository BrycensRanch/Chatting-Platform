/* eslint-disable unused-imports/no-unused-vars */
import type { FastifyGracefulExitOptions } from '@mgcrea/fastify-graceful-exit';
import fastifyGracefulExit from '@mgcrea/fastify-graceful-exit';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyGracefulExitOptions>(async (fastify) => {
  fastify.register(fastifyGracefulExit, { timeout: 3000 });
});
