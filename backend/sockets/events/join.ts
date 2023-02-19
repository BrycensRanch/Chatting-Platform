import type { Server, Socket } from 'socket.io';
import type { z } from 'zod';

import { roomRequiredSchema } from './message';

export default async (
  socket: Socket,
  io: Server,
  roomName: z.infer<typeof roomRequiredSchema>
) => {
  roomRequiredSchema.safeParse(roomName);
  const { rooms } = io.sockets.adapter;
  const room = rooms.get(roomName);
  if (roomName.length > 50) return;

  // room == undefined when no such room exists.
  if (room === undefined) {
    socket.join(roomName);
    socket.emit('created');
    io.fastify.log.info(
      `room admin of ${roomName} is now connected (${socket.id})`
    );
  } else {
    switch (roomName) {
      case 'connect_error':
        if (process.env.NODE_ENV !== 'production') {
          socket.emit('connect_error', new Error('banned room name'));
        }
        break;
      case 'kickout_event':
        if (process.env.NODE_ENV !== 'production') {
          socket.emit('kickout', socket.id);
          // For disobedient/illegal clients, we need to disconnect manually them.

          const sockets = await io.in(socket.id).fetchSockets();
          // @ts-expect-error
          if (socket.length === 0) {
            io.fastify.log.info('socket not found for kick');
          } else {
            sockets.forEach((socket) => socket.disconnect());
          }
        }
        break;
      case 'full room':
        if (room.size === 1 && process.env.NODE_ENV !== 'production') {
          socket.emit('full');
        }
        break;
      default:
        if (room.size === 1) {
          // room.size == 1 when one person is inside the room.
          socket.join(roomName);
          const rawRooms = Array.from(io.of('/').adapter.rooms);
          const room = rawRooms
            .map((r: any) => {
              return {
                name: r[0],
                sockets: Array.from(r[1]),
              };
            })
            .find((r) => r.name === roomName);
          socket.emit('joined', room);
          io.fastify.log.info(`room ${roomName} is now full (${socket.id})`);
        } else {
          socket.emit('full');
          const sockets = await io.in(socket.id).fetchSockets();
          // For disobedient/illegal clients, we need to disconnect manually them.
          // @ts-expect-error
          if (socket.length === 0) {
            io.fastify.log.info('socket not found for kick');
          } else {
            sockets.forEach((socket) => socket.disconnect());
          }
          io.fastify.log.info(
            `socket ${socket.id} tried to join room ${roomName} but it was full`
          );
        }
    }
  }
};
