import type { Prisma } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';

const dbindex: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  const { prisma } = fastify;
  const opts = {
    schema: {
      description: 'Get all users',
      tags: ['user'],
      summary: 'qwerty',
    },
    response: {
      default: [],
    },
  };
  // @ts-ignore
  fastify.get('/users', opts, async (_req, reply) => {
    reply.send(await prisma.user.findMany());
  });

  fastify.put<{
    Params: IPostByIdParam;
  }>('/post/:id/views', async (req, _res) => {
    const { id } = req.params;

    try {
      const post = await prisma.post.update({
        where: { id: Number(id) },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      return post;
    } catch (error) {
      return { error: `Post with ID ${id} does not exist in the database` };
    }
  });

  fastify.put<{
    Params: IPostByIdParam;
  }>('/publish/:id', async (req, _res) => {
    const { id } = req.params;

    try {
      const postData = await prisma.post.findUnique({
        where: { id: Number(id) },
        select: {
          published: true,
        },
      });

      const updatedPost = await prisma.post.update({
        where: { id: Number(id) || undefined },
        data: { published: !postData?.published },
      });
      return updatedPost;
    } catch (error) {
      return { error: `Post with ID ${id} does not exist in the database` };
    }
  });

  fastify.delete<{
    Params: IPostByIdParam;
  }>(`/post/:id`, async (req, _res) => {
    const { id } = req.params;
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    return post;
  });

  fastify.get<{
    Params: IPostByIdParam;
  }>('/user/:id/drafts', async (req, _res) => {
    const { id } = req.params;

    const drafts = await prisma.user
      .findUnique({
        where: { id: Number(id) },
      })
      .posts({
        where: { published: false },
      });

    return drafts;
  });

  fastify.get<{
    Params: IPostByIdParam;
  }>(`/post/:id`, async (req, _res) => {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    return post;
  });

  fastify.get<{
    Querystring: IFeedQueryString;
  }>('/feed', async (req, _res) => {
    const { searchString, skip, take, orderBy } = req?.query;

    const or: Prisma.PostWhereInput = searchString
      ? {
          OR: [
            { title: { contains: searchString as string } },
            { content: { contains: searchString as string } },
          ],
        }
      : {};

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...or,
      },
      include: { author: true },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy as Prisma.SortOrder,
      },
    });

    return posts;
  });
  interface IFeedQueryString {
    searchString: string | null;
    skip: number | null;
    take: number | null;
    orderBy: Prisma.SortOrder | null;
  }

  interface IPostByIdParam {
    id: number;
  }

  // interface ICreatePostBody {
  //   title: string;
  //   content: string | null;
  //   authorEmail: string;
  // }
};

export default dbindex;
