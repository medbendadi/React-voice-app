import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Shared/Button/Button'



import styles from './Home.module.css'
const Home = () => {
   const navigate = useNavigate()
   const startRegister = () => {
      navigate('/authenticate')
   }
   return (
      <div className={styles.cardWrapper}>

         <div className={styles.card}>
            <img
               className={styles.homeLogo}
               src="/images/logo.png"
               alt="" />

            <div className={styles.headingContent}>
               <h1>Welcome to Infinity</h1>
               <p>Talk With No <span>Limits</span></p>
            </div>
            <div>
               <Button onClick={startRegister} text="Get Started" />
            </div>
            <div className={styles.signInWrapper}>
               <span>Have an invite text ?</span>
               <Link to='/login'>
                  Register
               </Link>
            </div>
         </div>
      </div>
   )
}

export default Home