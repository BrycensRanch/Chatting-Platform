import type { Server, Socket } from 'socket.io';

export default async (socket: Socket, io: Server, roomName: string) => {
  const { rooms } = io.sockets.adapter;
  const room = rooms.get(roomName);
  if (roomName.length > 50) return;

  // room == undefined when no such room exists.
  if (room === undefined) {
    socket.join(roomName);
    socket.emit('created');
  } else if (
    room.size === 1 &&
    process.env.NODE_ENV !== 'production' &&
    roomName !== 'full room'
  ) {
    // room.size == 1 when one person is inside the room.
    socket.join(roomName);
    const rawRooms = Array.from(io.of('/').adapter.rooms);
    const room = rawRooms
      .map((r: any) => {
        return {
          name: r[0],
          sockets: Array.from(r[1]),
        };
      })
      .find((r) => r.name === roomName);
    socket.emit('joined', room);
    const hostSocket = room?.sockets[0];
    console.log(`room admin of ${roomName} is now connected (${hostSocket})`);
  } else if (
    roomName === 'connect_error' &&
    process.env.NODE_ENV !== 'production'
  ) {
    socket.emit('connect_error', new Error('banned room name'));
  } else if (
    roomName === 'kickout_event' &&
    process.env.NODE_ENV !== 'production'
  ) {
    socket.emit('kickout', socket.id);
  } else {
    // when there are already two people inside the room.
    socket.emit('full');
  }
};
