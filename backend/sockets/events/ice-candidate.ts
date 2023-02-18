import type { Server, Socket } from 'socket.io';

export default async (
  socket: Socket,
  io: Server,
  iceCandidate: RTCIceCandidate,
  roomName: string
) => {
  io.fastify.log.info(iceCandidate);
  socket.broadcast.to(roomName).emit('ice-candidate', iceCandidate); // Informs the other peer in the room.
}; // End of async default function.
