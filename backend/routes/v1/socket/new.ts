import type { FastifyPluginAsync } from 'fastify';

const example: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/new', async (_request, _reply) => 'new socket');
};

export default example;
