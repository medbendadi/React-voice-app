import React, { useRef, useState } from 'react'
import Button from '../../../../components/Shared/Button/Button'
import Card from '../../../../components/Shared/Card/Card'
import TextInput from '../../../../components/Shared/TextInput/TextInput'

import styles from '../Step.module.css'

import { toast } from 'react-toastify'
import { sendOtp } from '../../../../http'
import { setOtp } from '../../../../app/authSlice'
import { useDispatch } from 'react-redux'



const emailVerification = (email) => {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

const Email = ({ onNext }) => {
   const dispatch = useDispatch()
   const [email, setEmail] = useState('')
   const toastId = useRef(null)
   const handleNext = async () => {
      if (emailVerification(email)) {
         toastId.current = toast.loading('Sending')
         const resp = await sendOtp({ email: email });
         if (resp.status === 200) {
            dispatch(setOtp({ email: resp.data.email, hash: resp.data.hash }))
            toast.dismiss(toastId.current)
            onNext()
         } else {
            toast.error('Invalid Number')
         }
         onNext()
      } else {
         toast.error('Invalid Email')
      }
   }
   return (
      <Card title='Enter Your Email Address' icon='mail-icon'>
         <div style={{ width: '300px' }}>
            <TextInput value={email} type='email' fullwidth="true" onChange={(e) => {
               setEmail(e.target.value)
            }} />
         </div>
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