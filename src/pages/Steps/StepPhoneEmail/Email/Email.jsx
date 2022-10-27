import React, { useState } from 'react'
import Button from '../../../../components/Shared/Button/Button'
import Card from '../../../../components/Shared/Card/Card'
import TextInput from '../../../../components/Shared/TextInput/TextInput'

import styles from '../Step.module.css'

import { toast } from 'react-toastify'



const emailVerification = (email) => {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

const Email = ({ onNext }) => {
   const [email, setEmail] = useState('')
   const handleNext = () => {
      console.log(emailVerification(email));
      if (emailVerification(email)) {
         onNext()
      } else {
         toast.error('Invalid Email')
      }
   }
   return (
      <Card title='Enter Your Email Address' icon='mail-icon'>
         <TextInput value={email} type='email' onChange={(e) => {
            console.log(e.target.value);
            setEmail(e.target.value)
         }} />
         <div>
            <div>
               <Button
                  onClick={handleNext}
                  text='Next'
               />
            </div>
            <p className={styles.bottomParagraph}>
               By entering your email, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
            </p>
         </div>
      </Card>
   )
}

export default Email