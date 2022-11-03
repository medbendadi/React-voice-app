import React, { useRef } from 'react'
import { LogOut, User } from 'react-feather'
import { Link } from 'react-router-dom'

import styles from './Dropdown.module.css'

const clickOUtsideRef = (content_ref, toggle_ref) => {
   document.addEventListener('mousedown', (e) => {
      if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
         content_ref.current.classList.toggle('activeDropbox')
      } else {
         if (content_ref.current && !content_ref.current.contains(e.target)) {
            content_ref.current.classList.remove('activeDropbox')

         }
      }
   })
}


const Dropdown = props => {
   const dropdown_toggle_el = useRef(null)
   const dropdown_content_el = useRef(null)

   const costumeToggle = () => (
      <div className={styles.topnav__rightUser}>
         <h3 className={styles.topnav__rightUser__name}>
            {props.user?.name}
         </h3>
         <div className={styles.topnav__rightUser__image}>
            <img src={props.user?.avatar} alt="" />
         </div>
      </div>
   )
   const renderUserMenu = (item, index) => (
      <Link key={index} to={
         (item.content === "Profile") ? '/profile' : '/'
      } onClick={
         (item.content === "Logout") ?
            (e) => {
               props.logoutUser()
            } :
            () => null}>
         <div className={styles.notificationItem}>
            {
               item.content === "Logout" ? <LogOut /> : <User />
            }
            {/* <i className={item.icon}></i> */}
            <span>{item.content}</span>
         </div>
      </Link>
   )

   clickOUtsideRef(dropdown_content_el, dropdown_toggle_el)

   return (
      <div className={styles.dropdown}>
         <button ref={dropdown_toggle_el} className={styles.dropdown__toggle}>
            {
               props.icon ? <i className={props.icon}></i> : ''
            }

            {
               props.badge ? <span className={styles.dropdown__toggleBadge}>{props.badge}</span> : ''
            }

            {
               costumeToggle(props.user)
            }
         </button>
         <div className={styles.dropdown__content} ref={dropdown_content_el}>
            {
               props.contentData.map((item, index) => renderUserMenu(item, index))
            }

            {
               props.renderFooter ? (
                  <div className={styles.dropdown__footer}>
                     {props.renderFooter()}
                  </div>
               ) : ''
            }
         </div>
      </div>
   )
}

export default Dropdown