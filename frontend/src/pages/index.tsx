/* eslint-disable react-hooks/rules-of-hooks */
// eslint-disable-next-line @next/next/no-document-import-in-page
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import Medal from '@/components/Medal';
import useSocket from '@/hooks/useSocket';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { ClientToServerEvents, ServerToClientEvents } from '@/types';

export type Room = {
  name: string;
  sockets: string[];
};

const Index = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setLoading] = useState(false);

  useSocket();
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  useEffect(() => {
    const unloadCallback = (_event: any) => {
      if (socketRef.current) socketRef.current.disconnect();
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  });
  const fetchRooms = async () => {
    if (!socketRef.current) {
      socketRef.current = io(
        process.env.NEXT_PUBLIC_BACKEND_SERVER || 'http://localhost:8000',
        {
          withCredentials: true,
        }
      );
      socketRef.current.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      socketRef.current.on('connect', () => {
        console.log(`Connected to Socket IO server for room information...`);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('disconnect', reason); // undefined
      });
      // socketRef.current.on('reconnect_attempt', () => {
      //   console.log('attempting to reconnect to socket');
      // });
    }
    socketRef.current.emit('get-rooms');
    socketRef.current.on('rooms', (fetchedRooms: Room[]) => {
      // socket.disconnect();
      // ignore errored/unitiatialized sockets
      setRooms(fetchedRooms.filter((r) => r.name !== r.sockets[0]));
      setLoading(false);
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRooms();
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  const router = useRouter();
  // const myLoader: ImageLoader = ({ src, width, quality }) => {
  //   return `${router.basePath}/assets/images/${src}?w=${width}&q=${
  //     quality || 75
  //   }`;
  // };
  useEffect(() => {
    setLoading(true);
    fetchRooms();
  }, []);
  const [roomName, setRoomName] = useState('');

  const joinRoom = () => {
    router.push(`/room/${roomName || Math.random().toString(36).slice(2)}`);
  };

  return (
    <Main
      meta={
        <Meta
          title="House Door"
          description="One on one calls powered by WebRTC"
        />
      }
    >
      <h1 role="heading">Rooms:</h1>
      {router.query.kicked ? (
        <Medal
          title="Kicked from room... :("
          body={router.query.reason as string}
        />
      ) : (
        ''
      )}
      {isLoading ? <p data-testid="isLoading">Loading...</p> : ''}
      {!rooms.length ? (
        <p data-testid="roomNotification">
          No room data or backend is offline or "unreachable"
        </p>
      ) : (
        ''
      )}
      <ul>
        {rooms?.map((room) => {
          // @ts-ignore
          return (
            <li key={room.name}>
              <a href={`/room/${room.name}`} id={`room-${room.name}`}>
                {room.name}
              </a>
            </li>
          );
        })}
      </ul>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinRoom();
          }}
        >
          <div>
            <label
              htmlFor="room"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Room
            </label>
            <input
              type="text"
              id="room"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="room name"
              data-testid="roomName"
              required
              aria-label="room name"
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
            />
            <button
              onClick={joinRoom}
              aria-label="Join Or Create Room"
              data-testid="joinOrCreateRoomButton"
              id="joinOrCreateRoomButton"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Join/Create Room
            </button>
          </div>
        </form>
      </main>
    </Main>
  );
};

export default Index;
