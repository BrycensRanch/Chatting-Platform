import type { Server, Socket } from 'socket.io';

export default async (
  socket: Socket,
  io: Server,
  offer: RTCSessionDescriptionInit,
  roomName: string
) => {
  socket.broadcast.to(roomName).emit('offer', offer); // Informs the other peer in the room.
}; // End of async default function.
