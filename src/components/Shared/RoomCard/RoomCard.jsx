import React from 'react'

import { User, Users } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import styles from './RoomCard.module.css'
const RoomCard = ({ room }) => {
   const navigate = useNavigate()
   return (
      <div onClick={() => navigate(`/room/${room.id}`)} className={styles.card}>
         <h3 className={styles.topic}>{room.topic}</h3>
         <div className={styles.speakers}>
            <div className={`${styles.avatars} ${room.speakers.length === 1 ? styles.singleSpeaker : ''}`}>
               {
                  room.speakers.map((speaker, index) => (
                     <img
                        key={index}
                        src={speaker.avatar} alt="speaker-avatar"
                     />
                  ))
               }
               <div className={styles.defaultAvatar}>
                  {room.speakers.length !== 1 ? '+' + (room.speakers.length - 2) : '+1'}
               </div>
            </div>
         </div>
         <div className={styles.peopleCount}>
            <span>{room.speakers.length}</span>
            <Users size={18} />
         </div>
      </div>
   )
}

export default RoomCard