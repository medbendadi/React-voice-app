import React, { useEffect, useState } from 'react'

import { Search, Users } from 'react-feather'
import RoomCard from '../../components/Shared/RoomCard/RoomCard';

import AddRoomModel from '../../components/Shared/AddRoomModal/AddRoomModal'

import { getAllRooms, getRoom } from '../../http';
import styles from './Rooms.module.css'
import Loader from '../../components/Shared/Loader/Loader';
import { toast } from 'react-toastify';
import RoomModal from '../../components/Shared/RoomModal/RoomModal';





const Rooms = () => {
   const [addModalIsOpen, setAddModalIsOpen] = useState(false)
   const [roomModalIsOpen, setRoomModalIsOpen] = useState(false)
   const [rooms, setRooms] = useState([])
   const [loading, setLoading] = useState(true)

   const [searchInput, setSearchInput] = useState('')
   const [searchedRoom, setSearchedRoom] = useState({})

   useEffect(() => {
      const fetchRooms = async () => {
         const res = await getAllRooms();
         if (res.status === 200) {
            setRooms(res.data);
         }
      };
      fetchRooms();
      setLoading(false)
   }, []);



   function showAddModal() {
      setAddModalIsOpen(true)
   }
   function hideAddModal() {
      setAddModalIsOpen(false)
   }

   function showRoomModal() {
      setRoomModalIsOpen(true)
   }
   function hideRoomModal() {
      setRoomModalIsOpen(false)
   }

   const onSearch = async (e) => {
      e.preventDefault()
      if (!searchInput) {
         return toast.error('Cannot Search with empty value')
      }
      try {
         const { data } = await getRoom(searchInput)
         setSearchedRoom(data)
         showRoomModal()
         // setRoom((prev) => data);

      } catch (err) {
         console.log(err);
         toast.error('No Room with this id')
      }
   }

   return loading ? <Loader message='Wait. Fetching rooms for you... ' /> : (
      <>
         <div className='container'>
            <div className={styles.roomsHeader}>
               <div className={styles.left}>
                  <span className={styles.heading}>All voice rooms</span>
                  <form className={styles.searchBox}>
                     <button onClick={onSearch} type='submit'>
                        <Search />
                     </button>
                     <input
                        type="text"
                        className={styles.searchInput}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder='Enter room id'
                     />
                  </form>
               </div>
               <div
                  onClick={showAddModal}
                  className={styles.right}>
                  <button className={styles.startRoomBtn}>
                     <Users />
                     <span>Create your own room</span>
                  </button>
               </div>
            </div>
            <div
               className={styles.roomsList}>
               {
                  rooms?.map((room) => (
                     <RoomCard room={room} key={room.id} />
                  ))
               }
            </div>
         </div>
         {
            addModalIsOpen && <AddRoomModel onClose={hideAddModal} />
         }
         {
            (roomModalIsOpen && searchedRoom) && <RoomModal onClose={hideRoomModal} room={searchedRoom} />
         }
      </>
   )
}

export default Rooms