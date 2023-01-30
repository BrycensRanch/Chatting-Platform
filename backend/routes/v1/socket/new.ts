import type { FastifyPluginAsync } from 'fastify';

const example: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/new', async function (request, reply) {
    return 'new socket';
  });
};

export default example;
