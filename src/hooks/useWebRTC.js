import { useCallback, useEffect, useRef } from "react"
import { useStateWithCallback } from "./useStateWithCallback"

import { socketInit } from '../socket';
import { ACTIONS } from "../actions";

import freeice from 'freeice'
import { closeRoom } from "../http";

export const useWebRTC = (roomId, user) => {
   const [clients, setClients] = useStateWithCallback([]);
   const [audioSource, setAudioSource] = useStateWithCallback();
   const audioElements = useRef({});
   const connections = useRef({});
   const socket = useRef(null);
   const localMediaStream = useRef(null);
   const localMediaDevices = useRef([]);
   const clientsRef = useRef(null);

   function enterAudioPlay() {
      const audio = new Audio('/audios/enter.mp3')

      return audio.play()
   }

   function leaveAudioPlay() {
      const audio = new Audio('/audios/leave.mp3')
      return audio.play()
   }

   function MicOnAudioPlay() {
      const audio = new Audio('/audios/mic-on.mp3')

      return audio.play()
   }

   function MicOffAudioPlay() {
      const audio = new Audio('/audios/mic-off.mp3')

      return audio.play()
   }

   const addNewClient = useCallback(
      (newClient, cb) => {
         const lookingFor = clients.find(
            (client) => client.id === newClient.id
         );

         if (lookingFor === undefined) {
            setClients(
               (existingClients) => [...existingClients, newClient],
               cb
            );
            enterAudioPlay()
         }
      },
      [clients, setClients]
   );

   useEffect(() => {
      clientsRef.current = clients;
   }, [clients]);

   useEffect(() => {
      const initChat = async () => {
         // if (window.stream) {
         // window.stream.getTracks().forEach(track => {
         //    track.stop();
         // });
         // }
         localMediaDevices.current = await (await navigator.mediaDevices.enumerateDevices()).filter((dv) => dv.kind === 'audioinput')
         socket.current = socketInit();
         await captureMedia();
         addNewClient({ ...user, muted: true, handOn: false }, () => {
            const localElement = audioElements.current[user.id];
            if (localElement) {
               localElement.volume = 0;
               localElement.srcObject = localMediaStream.current;
               window.stream = localElement;
            }
         });
         socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
            handleSetMute(isMute, userId);
         });
         // socket.current.on(ACTIONS.DIFEAN, ({ userId, isMute }) => {
         //    handleSetMute(isMute, userId);
         // });
         socket.current.on(ACTIONS.HAND_INFO, ({ userId, handOn }) => {
            handleSetHand(handOn, userId);
         });

         socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
         socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
         socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
         socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
         socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
            handleSetMute(true, userId);
            MicOffAudioPlay()
         });
         socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
            handleSetMute(false, userId);
            MicOnAudioPlay()
         });
         socket.current.on(ACTIONS.HAND, ({ peerId, userId }) => {
            handleSetHand(true, userId);
         });
         socket.current.on(ACTIONS.UNHAND, ({ peerId, userId }) => {
            handleSetHand(false, userId);
         });
         socket.current.emit(ACTIONS.JOIN, {
            roomId,
            user,
         });

         async function captureMedia() {
            // Start capturing local audio stream.
            localMediaStream.current =
               await navigator.mediaDevices.getUserMedia({
                  audio: true,
               });
         }
         async function handleNewPeer({
            peerId,
            createOffer,
            user: remoteUser,
         }) {
            if (peerId in connections.current) {
               return console.warn(
                  `You are already connected with ${peerId} (${user.name})`
               );
            }

            // Store it to connections
            connections.current[peerId] = new RTCPeerConnection({
               iceServers: freeice(),
            });

            // Handle new ice candidate on this peer connection
            connections.current[peerId].onicecandidate = (event) => {
               socket.current.emit(ACTIONS.RELAY_ICE, {
                  peerId,
                  icecandidate: event.candidate,
               });
            };

            // Handle on track event on this connection
            connections.current[peerId].ontrack = ({
               streams: [remoteStream],
            }) => {
               addNewClient({ ...remoteUser, muted: true, handOn: false }, () => {
                  // get current users mute info
                  const currentUser = clientsRef.current.find(
                     (client) => client.id === user.id
                  );
                  if (currentUser) {
                     socket.current.emit(ACTIONS.MUTE_INFO, {
                        userId: user.id,
                        roomId,
                        isMute: currentUser.muted,
                        handOn: currentUser.handOn,
                     });
                  }
                  if (audioElements.current[remoteUser.id]) {
                     audioElements.current[remoteUser.id].srcObject =
                        remoteStream;
                  } else {
                     let settled = false;
                     const interval = setInterval(() => {
                        if (audioElements.current[remoteUser.id]) {
                           audioElements.current[
                              remoteUser.id
                           ].srcObject = remoteStream;
                           settled = true;
                        }

                        if (settled) {
                           clearInterval(interval);
                        }
                     }, 300);
                  }
               });
            };

            // Add connection to peer connections track
            localMediaStream.current.getTracks().forEach((track) => {
               connections.current[peerId].addTrack(
                  track,
                  localMediaStream.current
               );
            });

            // Create an offer if required
            if (createOffer) {
               const offer = await connections.current[
                  peerId
               ].createOffer();

               // Set as local description
               await connections.current[peerId].setLocalDescription(
                  offer
               );

               // send offer to the server
               socket.current.emit(ACTIONS.RELAY_SDP, {
                  peerId,
                  sessionDescription: offer,
               });
            }
         }
         async function handleRemovePeer({ peerId, userId }) {
            // Correction: peerID to peerId
            if (connections.current[peerId]) {
               connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients((list) => list.filter((c) => c.id !== userId));
         }
         async function handleIceCandidate({ peerId, icecandidate }) {
            if (icecandidate) {
               connections.current[peerId].addIceCandidate(icecandidate);
            }
         }
         async function setRemoteMedia({
            peerId,
            sessionDescription: remoteSessionDescription,
         }) {
            connections.current[peerId].setRemoteDescription(
               new RTCSessionDescription(remoteSessionDescription)
            );

            // If session descrition is offer then create an answer
            if (remoteSessionDescription.type === 'offer') {
               const connection = connections.current[peerId];

               const answer = await connection.createAnswer();
               connection.setLocalDescription(answer);

               socket.current.emit(ACTIONS.RELAY_SDP, {
                  peerId,
                  sessionDescription: answer,
               });
            }
         }
         async function handleSetMute(mute, userId) {
            const clientIdx = clientsRef.current
               .map((client) => client.id)
               .indexOf(userId);
            const allConnectedClients = JSON.parse(
               JSON.stringify(clientsRef.current)
            );
            if (clientIdx > -1) {
               allConnectedClients[clientIdx].muted = mute;
               setClients(allConnectedClients);
            }
         }
         async function handleSetHand(hand, userId) {
            const clientIdx = clientsRef.current
               .map((client) => client.id)
               .indexOf(userId);
            const allConnectedClients = JSON.parse(
               JSON.stringify(clientsRef.current)
            );
            if (clientIdx > -1) {
               allConnectedClients[clientIdx].handOn = hand;
               setClients(allConnectedClients);
            }
         }
      };

      initChat();
      return () => {
         localMediaStream.current
            .getTracks()
            .forEach((track) => track.stop());
         socket.current.emit(ACTIONS.LEAVE, { roomId });
         for (let peerId in connections.current) {
            connections.current[peerId].close();
            delete connections.current[peerId];
            delete audioElements.current[peerId];
         }
         socket.current.off(ACTIONS.ADD_PEER);
         socket.current.off(ACTIONS.REMOVE_PEER);
         socket.current.off(ACTIONS.ICE_CANDIDATE);
         socket.current.off(ACTIONS.SESSION_DESCRIPTION);
         socket.current.off(ACTIONS.MUTE);
         socket.current.off(ACTIONS.UNMUTE);
         leaveAudioPlay()
      };
   }, []);

   const provideRef = (instance, userId) => {
      // console.log(instance.sinkId);
      audioElements.current[userId] = instance;
   };

   const handleMicDevice = (sinkId, userId) => {
      let cd = document.querySelector('audio.gum');
      // setAudioSource(mic)
      if (typeof cd.sinkId !== 'undefined') {
         cd.setSinkId(sinkId).then(() => {
            console.log(`Success, audio output device attached: ${sinkId} to element with ${cd.title} as source.`);
         }).catch(error => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
               errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
            // Jump back to first output device in the list as it's the default.
            // outputSelector.selectedIndex = 0;
         });
         // console.log(audioElements.current[userId]);
      }
      // if (typeof provideRef.sinkId !== 'undefined') {
      // }
      // audioElements.current[user.id] = mic
      // console.log(cd.sinkId);
      // console.log(localMediaStream.current.getTracks()[0])
      // localMediaStream.current.getTracks()[0].enabled = isMute;
      // console.log(localMediaStream.current.getTracks());
   }

   const handleMute = (isMute, userId) => {
      let settled = false;

      if (userId === user.id) {
         let interval = setInterval(() => {
            if (localMediaStream.current) {
               localMediaStream.current.getTracks()[0].enabled = !isMute;
               if (isMute) {
                  socket.current.emit(ACTIONS.MUTE, {
                     roomId,
                     userId: user.id,
                  });
               } else {
                  socket.current.emit(ACTIONS.UNMUTE, {
                     roomId,
                     userId: user.id,
                  });
               }
               settled = true;
            }
            if (settled) {
               clearInterval(interval);
            }
         }, 200);
      }
   };



   const handleHand = (handOn, userId) => {
      let settled = false;

      if (userId === user.id) {
         let interval = setInterval(() => {
            if (localMediaStream.current) {
               if (handOn) {
                  socket.current.emit(ACTIONS.HAND, {
                     roomId,
                     userId: user.id,
                  });
               } else {
                  socket.current.emit(ACTIONS.UNHAND, {
                     roomId,
                     userId: user.id,
                  });
               }
               settled = true;
            }
            if (settled) {
               clearInterval(interval);
            }
         }, 200);
      }
   };




   return {
      clients,
      provideRef,
      handleMute,
      handleHand,
      localMediaDevices,
      handleMicDevice
   };
};