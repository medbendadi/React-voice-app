import React, { useState } from 'react'
import TextInput from '../TextInput/TextInput'
import { X } from 'react-feather'
import { createRoom as create } from '../../../http'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

import styles from './AddRoomModal.module.css'
import { useDispatch } from 'react-redux'
import { addRoom, addPrivateRoom } from '../../../app/roomsSlice'


const types = [
   {
      name: 'Open',
      type: 'open',
      icon: 'earth.png'
   },
   {
      name: 'Private',
      type: 'private',
      icon: 'private.png'
   }
]
const AddRoomModal = ({ onClose }) => {
   const [roomType, setRoomType] = useState('open')
   const [topic, setTopic] = useState('')
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const [roomPasswordInput, setRoomPasswordInput] = useState('')



   function topicChange(e) {
      setTopic(e.target.value)
   }
   async function CreateRoom() {
      if (!topic || !roomType) {
         toast.error('All fields are required')
         return
      }
      if (roomType === 'open') {
         try {
            const { payload } = await dispatch(addRoom({ topic, roomType }))
            console.log(payload);
            navigate(`/room/${payload.id}`)
         } catch (err) {
            console.log(err);
         }
      } else {
         if (!roomPasswordInput) {
            toast.error('All fields are required')
            return
         }
         try {
            const { payload } = await dispatch(addPrivateRoom({ topic, roomType, password: roomPasswordInput }))
            console.log(payload);
            navigate(`/room/${payload.id}/${roomPasswordInput}`)
         } catch (err) {
            console.log(err);
         }
      }
   }
   return (
      <div className={styles.modalMask}>
         <div className={styles.body}>
            <button
               onClick={onClose}
               className={styles.close}>
               <X size={19} />
            </button>
            <div className={styles.header}>
               <h3>Enter the topic to be discussed</h3>
               <TextInput
                  value={topic}
                  onChange={topicChange}
                  fullwidth="true"
                  placeholder='room topic' />
               <h2>Room Types</h2>
               <div className={styles.roomTypes}>
                  {
                     types.map((type, index) => (
                        <div
                           onClick={() => setRoomType(type.type)}
                           key={index}
                           className={`${styles.typeBox} ${roomType === type.type ? styles.active : ''}`}>
                           <img
                              width={55}
                              height={55}
                              src={`/images/${type.icon}`} alt={type.name} />
                           <span>{type.name}</span>
                        </div>
                     ))
                  }
               </div>
            </div>
            <div className={styles.footer}>
               {
                  roomType === 'open' ? (
                     <>
                        <h2>Start a room, open to everyone</h2>
                        <button onClick={CreateRoom}>
                           <span>Let's Go</span>
                        </button>
                     </>
                  ) : roomType === 'private' && (
                     <>
                        <h2>Start a room, open only with password</h2>
                        <TextInput
                           value={roomPasswordInput}
                           onChange={(e) => setRoomPasswordInput(e.target.value)}
                           fullwidth="true"
                           placeholder='Password' />
                        <button onClick={CreateRoom}>
                           <span>Enter</span>
                        </button>
                     </>
                  )
               }
            </div>
         </div>
      </div>
   )
}

export default AddRoomModal