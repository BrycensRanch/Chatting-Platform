/* eslint-disable no-console */
import type { Server, Socket } from 'socket.io';

/**
 * Handle message from a client
 * If toId is provided message will be sent ONLY to the client with that id
 * If toId is NOT provided and room IS provided message will be broadcast to that room
 * If NONE is provided message will be sent to all clients
 */
export default async (
  socket: Socket,
  io: Server,
  rawMessage: any,
  toId = null,
  room = null
) => {
  let message;
  try {
    message = JSON.parse(rawMessage);
  } catch (e) {
    io.fastify.log.error('client sent raw message that isnt json');
  }
  if (!message) message = rawMessage;
  if (message.length > 2000) return; // this feature requires discord nitro :)
  if (toId) {
    io.fastify.log.info('From ', socket.id, ' to ', toId, message);

    io.to(toId).emit('message', message, socket.id);
  } else if (room) {
    io.fastify.log.info('From ', socket.id, ' to room: ', room, message);

    socket.broadcast.to(room).emit('message', message, socket.id);
  } else {
    io.fastify.log.info('From ', socket.id, ' to everyone ', message);

    socket.broadcast.emit('message', message, socket.id);
  }
};
