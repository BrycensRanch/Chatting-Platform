import type { Server, Socket } from 'socket.io';

export default async (
  socket: Socket,
  io: Server,
  webcamActive: boolean,
  roomName: string
) => {
  socket.broadcast
    .to(roomName)
    .emit(
      'message',
      `socket ${socket.id} ${
        webcamActive ? 'enabled' : 'disabled'
      } their camera/screen`
    ); // Informs the other peer in the room.
};
