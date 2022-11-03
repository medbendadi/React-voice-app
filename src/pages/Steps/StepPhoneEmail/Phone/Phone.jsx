import React, { useState } from 'react'
import Button from '../../../../components/Shared/Button/Button'
import Card from '../../../../components/Shared/Card/Card'
import InputPhone from '../../../../components/Shared/InputPhone/InputPhone'

import { toast } from 'react-toastify'
import styles from '../Step.module.css'
import { sendOtp } from '../../../../http/index'

import { useDispatch } from 'react-redux'
import { setOtp } from '../../../../app/authSlice'
const Phone = ({ onNext }) => {
   const [phoneNumber, setPhoneNumber] = useState()
   const dispatch = useDispatch();

   const handleNext = async (e) => {
      e.preventDefault()
      if (!phoneNumber) return toast.error('Invalid Number');

      // const url = `https://phonevalidation.abstractapi.com/v1/?api_key=88f4e35156fe4cfcb55c321881c39c79&phone=${phoneNumber}`

      // const res = await fetch(url)

      // if (res.ok) {
      const resp = await sendOtp({ phone: phoneNumber });
      if (resp.status === 200) {
         dispatch(setOtp({ phone: resp.data.phone, hash: resp.data.hash }))
         onNext()
      } else {
         toast.error('Invalid Number')
      }
   }
   return (
      <Card title='Enter Your Phone Number' icon='phone-icon'>
         <form onSubmit={handleNext}>
            <InputPhone value={phoneNumber} onChange={phone => {
               setPhoneNumber(phone)
            }} />
            <div>
               <div>
                  <Button
                     text='Next'
                  />
               </div>
               <p className={styles.bottomParagraph}>
                  By entering your Number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
               </p>
            </div>
         </form>
      </Card >
   )
}

export default Phone