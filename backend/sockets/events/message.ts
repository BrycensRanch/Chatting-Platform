/* eslint-disable no-console */
import type { Server, Socket } from 'socket.io';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

export const messageSchema = z.string().min(1).max(2000);
export const toIdSchema = z.string().min(1).max(2000).optional();
export const roomSchema = z.string().min(1).max(100).optional();
export const roomRequiredSchema = z.string().min(1).max(100);
export const socketIdSchema = z.string().min(1).max(200);

/**
 * Handle message from a client
 * If toId is provided message will be sent ONLY to the client with that id
 * If toId is NOT provided and room IS provided message will be broadcast to that room
 * If NONE is provided message will be sent to all clients
 */
export default async (
  socket: Socket,
  io: Server,
  message: z.infer<typeof messageSchema>,
  toId: z.infer<typeof toIdSchema>,
  roomName: z.infer<typeof roomSchema>
) => {
  messageSchema.safeParse(message);
  toIdSchema.safeParse(toId);
  roomSchema.safeParse(roomName);

  if (toId) {
    io.fastify.log.info('From ', socket.id, ' to ', toId, message);

    io.to(toId).emit('message', message, socket.id);
  } else if (roomName) {
    io.fastify.log.info('From ', socket.id, ' to room: ', roomName, message);

    socket.broadcast.to(roomName).emit('message', message, socket.id);
  } else {
    io.fastify.log.info('From ', socket.id, ' to everyone ', message);

    socket.broadcast.emit('message', message, socket.id);
  }
};
