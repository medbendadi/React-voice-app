import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../../http'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../app/authSlice'

import styles from './Navigation.module.css'

import Dropdown from '../Dropdown.jsx/Dropdown'


const user_menu = [
   {
      icon: "bx bx-user",
      content: "Profile"
   },
   {
      icon: "bx bx-log-out-circle bx-rotate-180",
      content: "Logout"
   }
]




const Navigation = () => {
   const [modal, setModal] = useState(false);
   const navigate = useNavigate()


   const dispatch = useDispatch()
   const { isAuth, user } = useSelector((state) => state.auth)

   async function logoutUser() {
      try {
         const { data } = await logout()
         if (data) {
            dispatch(setAuth(data))
         }
      } catch (err) {
         dispatch(setAuth({ "user": null, "auth": false }))
      }
   }
   const handleModal = () => {
      setModal(true)
   }

   function handleManualHome() {
      navigate('/rooms')
   }
   return (
      <nav className={` ${styles.navbar}`}>
         <div onClick={handleManualHome} className={styles.brandStyling}>
            <img
               className={styles.logoImage}
               src="/images/logo.png"
               alt="logo" />
            <span className={styles.logoText}>Infinity</span>
         </div>
         {
            (isAuth && user.avatar) ? (
               <Dropdown
                  user={user}
                  contentData={user_menu}
                  setModal={handleModal}
                  logoutUser={logoutUser}
               />
            ) : null
         }

      </nav>
   )
}

export default Navigation