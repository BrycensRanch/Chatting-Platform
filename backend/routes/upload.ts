import type { FastifyPluginAsync } from 'fastify';

const uploadRoute: FastifyPluginAsync = async (
  fastify,
  _opts
): Promise<void> => {
  fastify.post('/upload', {
    // preHandler: upload.single('avatar'),
    handler: (_request, reply) => {
      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
      reply.code(200).send('SUCCESS');
    },
  });
};

export default uploadRoute;
