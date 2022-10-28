import React, { useState } from 'react'
import Button from '../../../components/Shared/Button/Button'

import Card from '../../../components/Shared/Card/Card'
import TextInput from '../../../components/Shared/TextInput/TextInput'

import styles from './StepOtp.module.css'

import { verifyOtp } from '../../../http'
import { useSelector } from 'react-redux'
import { setAuth } from '../../../app/authSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const StepOtp = () => {
   const [otp, setOtp] = useState('')
   const dispatch = useDispatch()
   const { phone, hash } = useSelector((state) => state.auth.otp)


   async function submit() {
      if (!otp || !phone || !hash) {
         toast.error('Invalid Code')
         return;
      }
      try {
         const { data } = await verifyOtp({ otp, phone, hash })
         dispatch(setAuth(data))
      } catch (err) {
         console.log(err);
      }
   }


   return (
      <>
         <div className={styles.cardWrapper}>
            <Card title='Enter the code we just texted tou' icon='mail-icon'>
               <TextInput
                  value={otp}
                  type='text'
                  placeholder='code'
                  onChange={(e) => setOtp(e.target.value)} />
               <div>
                  <div>
                     <Button onClick={submit} text='Next' />
                  </div>
                  <p className={styles.bottomParagraph}>
                     By entering your email, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
                  </p>
               </div>
            </Card>
         </div>
      </>
   )
}

export default StepOtp