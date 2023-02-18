import type { Server, Socket } from 'socket.io';

export default async (socket: Socket, io: Server) => {
  const rawRooms = Array.from(io.of('/').adapter.rooms);
  const rooms = rawRooms.map((r: any) => {
    return {
      name: r[0],
      sockets: Array.from(r[1]),
    };
  });
  socket.emit('rooms', rooms);
};
