import type { Socket } from 'socket.io-client';

// I WANNNA GO HOMEEEEEEEEEEEEEEEEEEE
// WHY ARE TYPES THIS PAINFUL FOR SOCKET IO!?!?1 WHY!?!?!?

export type Nullable<T> = T | undefined;

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  joined: () => void;
  created: () => void;
  ready: (socketId: string) => void;
  leave: () => void;
  message: (rawMessage: any, toId?: string, room?: string) => void;
  full: () => void;
  offer: (offer: any) => void;
  answer: (answer: RTCSessionDescriptionInit) => void;
  'ice-candidate': (event: any) => void;
  kickout: (kickedSocketId: string) => void;
  rooms: (rooms: []) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  message: (rawMessage: any, toId?: string | null, room?: string) => void;
  join: (roomName: string) => void;
  leave: (roomName: string) => void;
  ready: (roomName: string) => void;
  offer: (offer: RTCSessionDescriptionInit, roomName: string) => void;
  answer: (answer: RTCSessionDescriptionInit, roomName: string) => void;
  'ice-candidate': (event: RTCIceCandidate, roomName: string) => void;
  kick: (socketId: string, roomName: string) => void;
  'get-rooms': () => void;
  video: (cameraActive: boolean, roomName: string) => void;
  audio: (micActive: boolean, roomName: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export interface SocketRef {
  current: Socket<ServerToClientEvents, ClientToServerEvents>;
}
