import type { Server, Socket } from 'socket.io';

export default async (
  socket: Socket,
  io: Server,
  micActive: boolean,
  roomName: string
) => {
  socket.broadcast
    .to(roomName)
    .emit(
      'message',
      `socket ${socket.id} ${
        micActive ? 'enabled' : 'disabled'
      } their mic/audio`
    ); // Informs the other peer in the room.
};
