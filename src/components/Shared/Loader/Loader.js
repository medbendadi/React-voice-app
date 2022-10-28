import React, { useEffect, useState } from 'react'
import Card from '../Card/Card'
import styles from './Loading.module.css'
import Lottie from 'react-lottie-player'
const Loader = ({ message }) => {
   const [animationData, setAnimationData] = useState();

   useEffect(() => {
      let isActive = true;
      if (isActive) import('./loader.json').then(setAnimationData);
      return () => { isActive = false };
   }, []);
   if (!animationData) return null;
   return (
      <div className='cardWrapper'>
         <Card>
            <div className={styles.content}>
               <Lottie
                  animationData={animationData}
                  className="player"
                  loop
                  play
                  speed={1.6}
               />
               {message && <span className={styles.message}>{message}</span>}
            </div>
         </Card>
      </div>
   )
}

export default Loader