/* eslint-disable unused-imports/no-unused-vars */
import type { FastifyGracefulExitOptions } from '@mgcrea/fastify-graceful-exit';
import fastifyGracefulExit from '@mgcrea/fastify-graceful-exit';
import fp from 'fastify-plugin';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyGracefulExitOptions>(async (fastify) => {
  const { redis: redisInstance } = fastify;
  fastify.prisma.$use(
    createPrismaRedisCache({
      models: [
        { model: 'User', excludeMethods: ['findMany'] },
        { model: 'Post', cacheTime: 180, cacheKey: 'article' },
      ],
      // @ts-ignore
      storage: { type: 'redis', options: { client: redisInstance } },
      cacheTime: 300,
      excludeModels: ['Product', 'Cart'],
      excludeMethods: ['count', 'groupBy', 'queryRaw'],
    })
  );
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'code', description: 'Code related end-points' },
      ],
      definitions: {
        User: {
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
  });
  // @ts-ignore
  await fastify.swagger();
  // @ts-ignore
  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      // @ts-ignore
      onRequest(request, reply, next) {
        next();
      },
      // @ts-ignore
      preHandler(request, reply, next) {
        next();
      },
    },
    // @ts-ignore
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  fastify.register(fastifyGracefulExit, { timeout: 3000 });
});
