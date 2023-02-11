/* eslint-disable no-console */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
// @ts-nocheck
// this entire file's types are so bad because no parity types...
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import Modal from '@/components/Medal';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { ClientToServerEvents, ServerToClientEvents } from '@/types';

import useSocket from '../../hooks/useSocket';
import type { Room } from '../index';

export const getServerSideProps: GetServerSideProps<{
  query: ParsedUrlQuery;
}> = async (context) => {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  };
};

const RoomPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // useSocket();
  useSocket();
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [peersSocketId, setPeersSocketId] = useState('');
  const [localSocketId, setLocalSocketId] = useState('');

  const [input, setInput] = useState('');

  const router = useRouter();
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const hostRef = useRef<boolean>(false);

  let roomName = (props?.query?.id as string) || (router.query.id as string);
  // @ts-ignore
  useEffect(() => {
    localStorage.debug = '*';
    const unloadCallback = (_event: any) => {
      if (socketRef.current) socketRef.current.disconnect();
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  });

  useEffect(() => {
    socketRef.current = io(
      process.env.BACKEND_SERVER || 'http://localhost:8000',
      {
        withCredentials: true,
      }
    );
    // reconnecting with out of order of events yields a broken page with out of sync data from the client and server
    socketRef.current.sendBuffer = [];

    socketRef.current.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    localStorage.debug = '*';
    socketRef.current.on('connect', () => {
      console.log('connected'); // x8WIv7-mJelg7on_ALbx
      // @ts-ignore
      socketRef.current.emit('message', 'why hello there');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('disconnect', reason); // undefined
    });

    // First we join a room
    socketRef.current.emit('join', roomName);

    socketRef.current.on('joined', handleRoomJoined);
    // If the room didn't exist, the server would emit the room was 'created'
    socketRef.current.on('created', handleRoomCreated);
    // Whenever the next person joins, the server emits 'ready'
    socketRef.current.on('ready', initiateCall);

    // Emitted when a peer leaves the room
    socketRef.current.on('leave', onPeerLeave);
    socketRef.current.on('kickout', onKickedFromRoom);

    socketRef.current.on('message', onMessage);

    // If the room is full, we show an alert
    socketRef.current.on('full', () => {
      router.push(
        `/?kicked=true&roomKickedFrom=${roomName}&reason=The room you are trying to join is full. Please try again later...`
      );
    });

    // Event called when a remote user initiating the connection and
    socketRef.current.on('offer', handleReceivedOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

    // clear up after
    return () => socketRef.current.disconnect();
  }, [roomName]);
  const sendMessage = (e) => {
    e.preventDefault();
    console.log(e);
    const message = e.target.target[0];
    console.log(`sending ${message} to room ${roomName}`);
    socketRef.current.emit('message', message, null, roomName);
  };
  const handleRoomJoined = (room: Room) => {
    console.log(room);
    roomName = room.name;
    router.push(`/room/${roomName}`);
    // eslint-disable-next-line prefer-destructuring
    if (!socketRef.current?.id) setLocalSocketId(room.sockets[1] as string);
    if (!peersSocketId.length) setPeersSocketId(room.sockets[0] as string);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current.play();
        };
        socketRef.current.emit('ready', roomName);
      })
      .catch((err) => {
        /* handle the error */
        console.log('error', err);
      });
  };

  const handleRoomCreated = () => {
    console.log('room created');
    hostRef.current = true;
    router.push(`/room/${roomName}?created=true`);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current.play();
        };
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  };

  const initiateCall = (peerSocketId: string) => {
    console.log('callInitiated');
    setLoading(false);
    setPeersSocketId(peerSocketId);
    if (hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      console.log(rtcConnectionRef);
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[0],
        userStreamRef.current
      );
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[1],
        userStreamRef.current
      );
      rtcConnectionRef.current
        .createOffer()
        .then((offer) => {
          rtcConnectionRef.current.setLocalDescription(offer);
          socketRef.current.emit('offer', offer, roomName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const onKickedFromRoom = (kickedSocketId: string) => {
    if (
      kickedSocketId === localSocketId ||
      kickedSocketId === socketRef.current?.id
    ) {
      socketRef.current.emit('leave', roomName);
      socketRef.current.disconnect();
      router.push(
        `/?kicked=true&roomKickedFrom=${roomName}&reason=Kicked by an room owner.`
      );
    } else if (peerVideoRef.current.srcObject) {
      console.log(`server kicked ${kickedSocketId}`);
      setPeersSocketId('');
      peerVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving all track of Peer.
      peerVideoRef.current.srcObject = undefined;
    }
  };
  const onPeerLeave = () => {
    // This person is now the creator because they are the only person in the room.
    hostRef.current = true;
    console.log('peerLeave');
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving all track of Peer.
      peerVideoRef.current.srcObject = undefined;
    }

    // Safely closes the existing connection established with the peer who left.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  const onMessage = (message) => {
    console.log(`Message from peer: ${message}`);
  };
  /**
   * Takes a userid which is also the socketid and returns a WebRTC Peer
   *
   * @param  {string} userId Represents who will receive the offer
   * @returns {RTCPeerConnection} peer
   */

  const createPeerConnection = () => {
    console.log('peerJoined');
    const ICE_SERVERS = {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
        {
          urls: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
      ],
    };
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS);

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent;

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleReceivedOffer = (offer) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      console.log('offer', rtcConnectionRef);
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[0],
        userStreamRef.current
      );
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[1],
        userStreamRef.current
      );
      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current
        .createAnswer()
        .then((answer) => {
          rtcConnectionRef.current.setLocalDescription(answer);
          socketRef.current.emit('answer', answer, roomName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAnswer = (answer) => {
    rtcConnectionRef.current
      .setRemoteDescription(answer)
      .catch((err) => console.log(err));
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      socketRef.current.emit('ice-candidate', event.candidate, roomName);
    }
  };

  const handlerNewIceCandidateMsg = (incoming) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      .addIceCandidate(candidate)
      .catch((e) => console.log(e));
  };

  const handleTrackEvent = (event) => {
    // eslint-disable-next-line prefer-destructuring
    peerVideoRef.current.srcObject = event.streams[0];
  };

  const toggleMediaStream = (type, state) => {
    userStreamRef.current.getTracks().forEach((track) => {
      if (track.kind === type) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = !state;
      }
    });
  };

  const toggleMic = () => {
    toggleMediaStream('audio', micActive);
    setMicActive((prev) => !prev);
    if (socketRef.current) {
      socketRef.current.emit('audio', micActive, roomName);
    }
  };

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive);
    setCameraActive((prev) => !prev);
    if (socketRef.current) {
      socketRef.current.emit('video', cameraActive, roomName);
    }
  };

  const leaveRoom = () => {
    socketRef.current.emit('leave', roomName); // Let's the server know that user has left the room.

    if (userVideoRef.current.srcObject) {
      userVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving all track of User.
    }
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving audio track of Peer.
      peerVideoRef.current.srcObject = undefined;
    }

    // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
    router.push('/');
  };
  const kickUser = () => {
    console.log(rtcConnectionRef.current);
    socketRef.current.emit('kick', peersSocketId, roomName); // Let's the server know that user has left the room.
    console.log('kicked noob');
  };
  const videoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('error:', err);
      });
  };
  const checkForVideoAudioAccess = async () => {
    try {
      const cameraResult = await navigator.permissions.query({
        name: 'camera',
      });
      // The state property may be 'denied', 'prompt' and 'granted'
      const isCameraAccessGranted = cameraResult.state !== 'denied';

      const microphoneResult = await navigator.permissions.query({
        name: 'microphone',
      });
      const isMicrophoneAccessGranted = microphoneResult.state !== 'denied';
      console.log(isMicrophoneAccessGranted, isCameraAccessGranted);
    } catch (e) {
      console.error('An error occurred while checking the site permissions', e);
    }

    return true;
  };
  useEffect(() => {
    checkForVideoAudioAccess();
  }, [videoRef]);
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input?.length) console.error('please type in msg before sending');
    console.log(`sending message "${input}" to room ${roomName}`);
    socketRef.current?.emit('message', input);
    setInput('');
  };
  const onChangeHandler = (e) => {
    setInput(e.target.value);
  };
  return (
    <Main
      meta={
        <Meta
          title={`${roomName} room`}
          description="One on one video calls... FACE TO FACE ON WEBRTC!!"
        />
      }
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {hostRef.current ? (
        <Modal
          initialValue={true}
          title="You're the boss!"
          body="You can kick people you don't like if you want. If you need, you can always share the room link to invite a friend to chat with!"
        />
      ) : !peersSocketId.length && !isLoading ? (
        <p id="youJoinedNotCreated">
          you joined the room instead of CREATING ONE...
        </p>
      ) : (
        ''
      )}
      <div>
        <h1 role="heading">Room name: {roomName || 'unknown'}</h1>
        <div>
          <p
            style={{
              // padding: 5px 15px;
              // text-align: center;
              padding: '5px 15px',
              textAlign: 'center',
            }}
          >
            (you) {hostRef.current ? '🤴👑' : ''} socketId:{' '}
            {socketRef.current?.id || localSocketId || 'unknown'}
          </p>
          <video autoPlay ref={userVideoRef} />
        </div>
        <div>
          <p>(random dude from internet) {!hostRef.current ? '🤴👑' : ''}</p>
          <p>{peersSocketId ? `SocketId: ${peersSocketId}` : ''}</p>
          <video autoPlay ref={peerVideoRef} />
          {hostRef.current ? (
            <button onClick={kickUser} id="kickButton">
              kick this noob
            </button>
          ) : (
            ''
          )}
        </div>
        <button onClick={toggleMic} id="toggleMic" type="button">
          {micActive ? 'Mute Mic' : 'UnMute Mic'}
        </button>
        <button onClick={leaveRoom} id="leaveRoom" type="button">
          Leave
        </button>
        <button onClick={toggleCamera} id="toggleCamera" type="button">
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
        <form onSubmit={onSubmit}>
          <input
            type="hidden"
            name="socket"
            id="localSocketId"
            value={localSocketId}
          />
          <div>
            <label
              htmlFor="message"
              data-testid="messageLabel"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Message
            </label>
            <input
              type="text"
              id="message"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="message"
              required
              value={input}
              data-testid="message"
              onChange={onChangeHandler}
            />
            <button
              type="submit"
              data-testid="messageSend"
              id="messageSend"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </Main>
  );
};

export default RoomPage;
