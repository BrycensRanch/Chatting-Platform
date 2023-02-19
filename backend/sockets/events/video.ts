import type { Server, Socket } from 'socket.io';
import type { z } from 'zod';

import { roomRequiredSchema } from './message';

export default async (
  socket: Socket,
  io: Server,
  webcamActive: boolean,
  roomName: z.infer<typeof roomRequiredSchema>
) => {
  roomRequiredSchema.safeParse(roomName);

  socket.broadcast
    .to(roomName)
    .emit(
      'message',
      `socket ${socket.id} ${
        webcamActive ? 'enabled' : 'disabled'
      } their camera/screen`
    ); // Informs the other peer in the room.
};
