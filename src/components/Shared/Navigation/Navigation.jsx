import React from 'react'

import { Link } from 'react-router-dom'


import styles from './Navigation.module.css'

const Navigation = () => {
   return (
      <nav className={`container ${styles.navbar}`}>
         <Link to='/' className={styles.brandStyling}>
            <img
               className={styles.logoImage}
               src="/images/logo.png"
               alt="logo" />
            <span className={styles.logoText}>Infinity</span>
         </Link>
      </nav>
   )
}

export default Navigation