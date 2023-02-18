import type { Server, Socket } from 'socket.io';

export default async (
  socket: Socket,
  io: Server,
  socketId: string,
  roomName: string
) => {
  // @ts-expect-error
  const hostSocketId = Array.from(io.of('/').adapter.rooms.get(roomName))[0];
  console.log(
    `host socket id ${hostSocketId} kicked ${socketId} from room ${roomName}`
  );
  if (hostSocketId !== socketId) {
    console.log('valid kick');
    socket.broadcast.to(roomName).emit('kickout', socketId);
  }
  // const hostSocket = sockets.values().next().value;
  // if (socket.id === hostSocket?.id) {
  //   socket.broadcast.emit('kickout', socketId);
  //   console.log(io.sockets.sockets);
  //   // io.sockets.sockets.get(socketId).leave(room);
  // } else {
  //   console.log('not an admin');
  // }
};
