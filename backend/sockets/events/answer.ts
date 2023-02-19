import type { Server, Socket } from 'socket.io';
import type { z } from 'zod';

import { roomRequiredSchema } from './message';

export default async (
  socket: Socket,
  io: Server,
  roomName: z.infer<typeof roomRequiredSchema>
) => {
  roomRequiredSchema.safeParse(roomName);
  socket.broadcast.to(roomName).emit('answer', socket.id); // Informs the other peer in the room.
};
