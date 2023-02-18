import type { Server, Socket } from 'socket.io';
import type { z } from 'zod';

import { roomRequiredSchema } from './message';

export default async (
  socket: Socket,
  io: Server,
  offer: RTCSessionDescriptionInit,
  roomName: z.infer<typeof roomRequiredSchema>
) => {
  roomRequiredSchema.parse(roomName);

  socket.broadcast.to(roomName).emit('offer', offer); // Informs the other peer in the room.
}; // End of async default function.
