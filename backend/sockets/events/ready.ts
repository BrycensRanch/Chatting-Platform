import type { Server, Socket } from 'socket.io';

export default async (socket: Socket, io: Server, roomName: string) => {
  socket.broadcast.to(roomName).emit('ready', socket.id); // Informs the other peer in the room.
};
