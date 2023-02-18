import type { Server, Socket } from 'socket.io';

export default async (socket: Socket, io: Server, roomName: string) => {
  socket.leave(roomName);
  socket.broadcast.to(roomName).emit('leave');
};
