import React from 'react'

import { Link } from 'react-router-dom'
import { logout } from '../../../http'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../app/authSlice'

import styles from './Navigation.module.css'

const Navigation = () => {
   const dispatch = useDispatch()
   const { isAuth } = useSelector((state) => state.auth)
   async function logoutUser() {
      try {
         const { data } = await logout()
         console.log(data);
         dispatch(setAuth(data))
      } catch (err) {
         console.log(err);
      }
   }
   return (
      <nav className={`container ${styles.navbar}`}>
         <Link to='/' className={styles.brandStyling}>
            <img
               className={styles.logoImage}
               src="/images/logo.png"
               alt="logo" />
            <span className={styles.logoText}>Infinity</span>
         </Link>
         {
            (isAuth) ? (
               <button onClick={logoutUser} className={styles.logoutButton}>Logout</button>
            ) : null
         }

      </nav>
   )
}

export default Navigation