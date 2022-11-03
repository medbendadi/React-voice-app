import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Mic, MicOff, PhoneOff } from 'react-feather'

import styles from './Room.module.css'
import Loader from '../../components/Shared/Loader/Loader'
import { closeRoom, getPrivateRoom, getRoom } from '../../http/index'
import { toast } from 'react-toastify'
import axios from 'axios'
import { setAuth } from '../../app/authSlice'
import randomColor from "randomcolor";


const colors = [
   '--blue',
   '--pink',
   '--indigo',
   '--purple',
   '--success',
   '--danger',
]

const Room = () => {
   const { id: roomId, password } = useParams()
   const user = useSelector(state => state.auth.user)
   const [room, setRoom] = useState(null)
   const { clients, provideRef, handleMute, localMediaDevices, handleMicDevice, handleHand } = useWebRTC(roomId, user);
   const [currentClient, setCurrentClient] = useState({})
   const navigate = useNavigate()
   const dispatch = useDispatch()


   const [isMute, setMute] = useState(true)
   const [handOn, setHand] = useState(false)

   console.log(localMediaDevices.current);

   useEffect(() => {
      handleMute(isMute, user.id)
   }, [isMute])

   useEffect(() => {
      handleHand(handOn, user.id)
   }, [handOn])

   useEffect(() => {
      const client = clients.filter((client) => client === user)
      setCurrentClient(client)
   }, [clients])

   useEffect(() => {
      clients.forEach((client) => {
         if (!client.borderColor) {
            client.borderColor = randomColor()
         }
      })
   }, [clients])

   useEffect(() => {
      try {
         if (password) {
            const fetchRoom = async () => {
               const { data } = await getPrivateRoom(roomId, { password: password })
               if (!data) {
                  toast.error('No Room with this id')
                  return navigate('/rooms')
               }
               console.log(data);
               setRoom(data);
            }
            fetchRoom()
         } else {
            const fetchRoom = async () => {
               const { data } = await getRoom(roomId)
               if (!data) {
                  toast.error('No Room with this id')
                  return navigate('/rooms')
               }
               if (data.password) {
                  toast.error('You need password First')
                  navigate('/rooms')
                  return;
               }
               console.log(data);
               setRoom(data);
            }
            fetchRoom()
         }

      } catch (err) {
         console.log(err);
      }
   }, [roomId])


   function onMicChange(e) {
      console.log(e.target.value);
      let currentMic = localMediaDevices.current.filter(dv => dv.label === e.target.value)
      console.log(currentMic[0].deviceId);
      handleMicDevice(currentMic[0].deviceId, user.id)
   }


   async function handleManualLeave() {
      if (user.id === room?.ownerId) {
         await closeRoom(room._id)
      }
      navigate('/rooms')
   }

   const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
         handleManualLeave()
      }
   };

   useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);

      setInterval(async () => {
         try {
            const { data } = await axios.get(
               `${process.env.REACT_APP_API}/api/refresh`,
               {
                  withCredentials: true,
               }
            );
            dispatch(setAuth(data));
         } catch (err) {
            console.log(err);
         }
      }, 20 * 60000)

      // cleanup this component
      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, []);


   const handleMuteClick = (clientId) => {
      if (clientId === user.id) {
         setMute((prev) => !prev)
      } else {
         return;
      }
   }

   const handleHandClick = (clientId) => {
      if (clientId === user.id) {
         setHand((prev) => !prev)
      } else {
         return;
      }
   }


   return !room ? <Loader message='Wait. Fetching rooms for you... ' /> : (
      <div>
         <div className='container'>
            <button className={styles.goBack} onClick={handleManualLeave}>
               <ArrowLeft />
               <span>All voice rooms</span>
            </button>
         </div>

         <div className={styles.clientsWrap}>
            <div className={styles.header}>
               <div className={styles.topic}>
                  <h2>
                     {room?.topic}
                  </h2>
                  <span>#{room._id}</span>
               </div>
               <div className={styles.actions}>
                  <button className={styles.hand} onClick={() => handleHandClick(user.id)}>
                     <img
                        width={35}
                        height={35}
                        src="/images/stop.png" alt="hand up" />
                  </button>
                  {/* <div className={styles.exitWrap}>
                     <button onClick={handleManualLeave}>
                        <span>Leave quietly</span>
                     </button>
                     <span>Or</span>
                     <button className={styles.esc}>
                        <div>
                           <span>Esc</span>
                        </div>
                     </button>
                  </div> */}
               </div>
            </div>
            <div className={styles.clientsList}>
               {
                  clients.map((client) => (
                     <div key={client.id} className={styles.client}>
                        <div
                           className={styles.userHead}
                           style={{ border: `5px solid ${client.borderColor}` }}>
                           <audio
                              ref={(instance) => provideRef(instance, client.id)}
                              autoPlay
                              className="gum"
                           ></audio>
                           <img
                              src={client.avatar} alt="avatar" />
                           <button
                              className={styles.micBtn}>
                              {
                                 client.muted ? (
                                    <img src='/images/mic-mute.png' alt="mic-mute-icon" />
                                 ) : (
                                    <img src='/images/mic.png' alt="mic-icon" />
                                 )
                              }
                           </button>


                           {
                              client.handOn ? (
                                 <button
                                    className={styles.handBtn}>
                                    <img src="/images/stop.png" alt="hand up" />
                                 </button>
                              ) : (
                                 null
                              )
                           }
                        </div>
                        <h4>{client.name}</h4>
                     </div>
                  ))
               }
            </div>
         </div>
         <div className={styles.SelectContainer}>
            <button className={styles.phoneBtn} onClick={handleManualLeave}>
               <PhoneOff />
            </button>
            {/* <h4>Audio Input: </h4> */}
            <select onChange={onMicChange}>
               {/* <option value=''>select</option> */}
               {
                  localMediaDevices.current?.map((device, index) => (
                     <option key={index} value={device.label}>{device.label}</option>
                  ))
               }
            </select>
            <button className={styles.bottomMicBtn} onClick={() => handleMuteClick(user.id)}>
               {
                  currentClient.muted ? <Mic /> : <MicOff />
               }
            </button>
         </div>
         {/* <select onChange={onMicChange}>
         </select> */}
      </div>
   )
}

export default Room