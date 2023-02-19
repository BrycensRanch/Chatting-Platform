import type { Server, Socket } from 'socket.io';
import type { z } from 'zod';

import { roomRequiredSchema, socketIdSchema } from './message';

export default async (
  socket: Socket,
  io: Server,
  socketId: z.infer<typeof socketIdSchema>,
  roomName: z.infer<typeof roomRequiredSchema>
) => {
  socketIdSchema.safeParse(socketId);
  roomRequiredSchema.safeParse(roomName);
  // @ts-expect-error
  const hostSocketId = Array.from(io.of('/').adapter.rooms.get(roomName))[0];
  if (hostSocketId !== socketId) {
    io.fastify.log.info(
      `host socket id ${hostSocketId} kicked ${socketId} from room ${roomName}`
    );
    socket.broadcast.to(roomName).emit('kickout', socketId);
    // For disobedient/illegal clients, we need to disconnect manually them.
    const sockets = await io.in(socketId).fetchSockets();
    // @ts-expect-error
    if (socket.length === 0) {
      io.fastify.log.info('socket not found for kick');
    } else {
      sockets.forEach((socket) => socket.disconnect());
    }
  }
  // const hostSocket = sockets.values().next().value;
  // if (socket.id === hostSocket?.id) {
  //   socket.broadcast.emit('kickout', socketId);
  //   io.fastify.log.info(io.sockets.sockets);
  //   // io.sockets.sockets.get(socketId).leave(room);
  // } else {
  //   io.fastify.log.info('not an admin');
  // }
};
