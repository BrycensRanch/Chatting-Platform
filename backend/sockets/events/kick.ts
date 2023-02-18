import type { Server, Socket } from 'socket.io';

export default async (
  socket: Socket,
  io: Server,
  socketId: string,
  roomName: string
) => {
  // @ts-expect-error
  const hostSocketId = Array.from(io.of('/').adapter.rooms.get(roomName))[0];
  io.fastify.log.info(
    `host socket id ${hostSocketId} kicked ${socketId} from room ${roomName}`
  );
  if (hostSocketId !== socketId) {
    io.fastify.log.info('valid kick');
    socket.broadcast.to(roomName).emit('kickout', socketId);
  }
  // const hostSocket = sockets.values().next().value;
  // if (socket.id === hostSocket?.id) {
  //   socket.broadcast.emit('kickout', socketId);
  //   io.fastify.log.info(io.sockets.sockets);
  //   // io.sockets.sockets.get(socketId).leave(room);
  // } else {
  //   io.fastify.log.info('not an admin');
  // }
};
