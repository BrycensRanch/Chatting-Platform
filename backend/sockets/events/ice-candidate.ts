import type { Server, Socket } from 'socket.io';
import type { z } from 'zod';

import { roomRequiredSchema } from './message';

export default async (
  socket: Socket,
  io: Server,
  iceCandidate: RTCIceCandidate,
  roomName: z.infer<typeof roomRequiredSchema>
) => {
  roomRequiredSchema.safeParse(roomName);
  io.fastify.log.info(iceCandidate);
  socket.broadcast.to(roomName).emit('ice-candidate', iceCandidate); // Informs the other peer in the room.
}; // End of async default function.
