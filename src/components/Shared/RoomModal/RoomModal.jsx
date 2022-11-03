import { useState } from "react"
import { X } from "react-feather"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getPrivateRoom } from "../../../http"
import TextInput from "../TextInput/TextInput"

import styles from './RoomModal.module.css'
const RoomModal = ({ onClose, room }) => {
   const [roomPasswordInput, setRoomPasswordInput] = useState('')
   const navigate = useNavigate()


   async function enterOpenRoom() {

   }


   async function enterPrivateRoom() {
      if (!roomPasswordInput) {
         return toast.error('Enter room password first')
      }
      // console.log(room._id);
      try {
         const { data } = await getPrivateRoom(room._id, { password: roomPasswordInput })
         console.log(data.id);
         navigate(`/room/${room._id}/${roomPasswordInput}`)
      } catch (err) {
         return toast.error('Wrong Password!')
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
               <h2>{room.topic}</h2>
               <h5>{room.roomType}</h5>
               {/* <TextInput
                  value={topic}
                  onChange={topicChange}
                  fullwidth="true"
                  placeholder='room topic' /> */}
            </div>
            <div className={styles.footer}>
               {
                  room.roomType === 'open' ? (
                     <>
                        <h2>Start a room, open to everyone</h2>
                        <button onClick={enterOpenRoom}>
                           <span>Enter</span>
                        </button>
                     </>
                  ) : room.roomType === 'private' && (
                     <>
                        <h2>This room is private enter password to enter</h2>
                        <TextInput
                           value={roomPasswordInput}
                           onChange={(e) => setRoomPasswordInput(e.target.value)}
                           fullwidth="true"
                           placeholder='Password' />
                        <button onClick={enterPrivateRoom}>
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

export default RoomModal
