import type { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/health', (request, reply) => {
    reply.send({
      statusCode: 200,
      status: 'ok',
      uptime: process.uptime(),
      'req-id': request.id,
      'cluster-id': process.env.NODE_APP_INSTANCE || '0',
    });
  });
};

export default health;
