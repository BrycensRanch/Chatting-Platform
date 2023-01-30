import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import useSocket from '../../hooks/useSocket';

const Room = () => {
  useSocket();
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  const router = useRouter();
  const userVideoRef = useRef();
  const peerVideoRef = useRef();
  const rtcConnectionRef = useRef(null);
  const socketRef = useRef();
  const userStreamRef = useRef();
  const hostRef = useRef(false);

  const { id: roomName } = router.query;
  useEffect(() => {
    socketRef.current = io('http://localhost:8000', {
      // withCredentials: true,
    });
    socketRef.current.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    localStorage.debug = '*';
    socketRef.current.on('connect', () => {
      console.log('connected'); // x8WIv7-mJelg7on_ALbx
      socketRef.current.emit('message', 'why hello there');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('disconnect', reason); // undefined
    });
    socketRef.current.on('reconnect_attempt', () => {
      console.log('attempting to reconnect to socket');
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
    socketRef.current.on('message', onMessage);

    // If the room is full, we show an alert
    socketRef.current.on('full', () => {
      window.location.href = '/';
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
  const handleRoomJoined = () => {
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

  const initiateCall = async () => {
    console.log('callInitiated');

    if (hostRef.current) {
      rtcConnectionRef.current = await createPeerConnection();
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

  const onPeerLeave = () => {
    // This person is now the creator because they are the only person in the room.
    hostRef.current = true;
    console.log('peerLeave');
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving all track of Peer.
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
  };

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive);
    setCameraActive((prev) => !prev);
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
    if (!rtcConnectionRef.current) {
      alert("someone's alonely LMFAOOO LLLL");
    } else {
      socketRef.current.emit('kick', 'other peer', roomName); // Let's the server know that user has left the room.
      alert('kicked noob');
    }
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

  return (
    <Main
      meta={<Meta title={`${roomName} room`} description="MURICA HECK YEAH " />}
    >
      <div>
        <h1>Room name: {roomName || 'unknown'}</h1>
        <div>
          <p
            style={{
              // padding: 5px 15px;
              // text-align: center;
              padding: '5px 15px',
              textAlign: 'center',
            }}
          >
            (you)
          </p>
          <video autoPlay ref={userVideoRef} />
        </div>
        <div>
          <p>(random dude from internet)</p>
          <video autoPlay ref={peerVideoRef} />
          <button onClick={kickUser}>kick this noob</button>
        </div>
        <button onClick={toggleMic} type="button">
          {micActive ? 'Mute Mic' : 'UnMute Mic'}
        </button>
        <button onClick={leaveRoom} type="button">
          Leave
        </button>
        <button onClick={toggleCamera} type="button">
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
        <form onSubmit={sendMessage}>
          <label>
            message:
            <input type="text" name="message" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </Main>
  );
};

export default Room;
