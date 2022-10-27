import React, { useState } from 'react'
import Email from './Email/Email'
import Phone from './Phone/Phone'
import styles from './Step.module.css'
import { Smartphone, Mail } from 'react-feather'


const phoneEmailMap = {
   phone: Phone,
   email: Email
}

const StepPhoneEmail = ({ onNext }) => {
   const [type, setType] = useState('phone')
   const Component = phoneEmailMap[type]

   return (
      <>
         <div className={styles.cardWrapper}>
            <div>
               <div className={styles.buttonWrap}>
                  <button
                     className={type === 'phone' ? styles.active : ''}
                     onClick={() => setType('phone')}>
                     <Smartphone />
                  </button>
                  <button
                     className={`${type === 'email' ? styles.active : ''}`}
                     onClick={() => setType('email')}>
                     <Mail />
                  </button>
               </div>
               <Component onNext={onNext} />
            </div>
         </div>
      </>
   )
}

export default StepPhoneEmail