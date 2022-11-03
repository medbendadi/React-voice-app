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
   const dispatch = useDispatch()
   const { phone, hash, email } = useSelector((state) => state.auth.otp)
   const [state, setState] = useState({ value: "", otp1: "", otp2: "", otp3: "", otp4: "", disable: true })



   async function submit(e) {
      e.preventDefault()
      if (!state.otp1 || !state.otp2 || !state.otp3 || !state.otp4 || (!phone && !email) || !hash) {
         toast.error('Invalid Code')
         return;

      }
      const otp = state.otp1 + state.otp2 + state.otp3 + state.otp4

      try {
         if (phone) {
            const { data } = await verifyOtp({ otp, phone, hash })
            dispatch(setAuth(data))
         } else {
            const { data } = await verifyOtp({ otp, email, hash })
            dispatch(setAuth(data))
         }
      } catch (err) {
         console.log(err);
      }
   }

   function handleChange(value1, event) {
      setState({ ...state, [value1]: event.target.value })
   }

   const inputfocus = (elmnt) => {
      if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
         if (elmnt.target.value === '') {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {
               elmnt.target.form.elements[next].focus()
            }
         }
      }
      else {
         if (elmnt.target.value !== '') {
            const next = elmnt.target.tabIndex;
            if (next < 4) {
               elmnt.target.form.elements[next].focus()
            }
         }
      }

   }
   return (
      <>
         <form onSubmit={submit}>
            <div className={styles.cardWrapper}>
               <Card title='Enter the code we just texted tou' icon='mail-icon'>
                  <div className={styles.otpContainer}>

                     <input
                        name="otp1"
                        type="text"
                        autoComplete="off"
                        className="otpInput"
                        value={state.otp1}
                        autoFocus
                        // onKeyPress={keyPressed}
                        onChange={e => handleChange("otp1", e)}
                        tabIndex="1" maxLength="1" onKeyUp={e => inputfocus(e)}

                     />
                     <input
                        name="otp2"
                        type="text"
                        autoComplete="off"
                        className="otpInput"
                        value={state.otp2}
                        onChange={e => handleChange("otp2", e)}
                        tabIndex="2" maxLength="1" onKeyUp={e => inputfocus(e)}

                     />
                     <input
                        name="otp3"
                        type="text"
                        autoComplete="off"
                        className="otpInput"
                        value={state.otp3}
                        onChange={e => handleChange("otp3", e)}
                        tabIndex="3" maxLength="1" onKeyUp={e => inputfocus(e)}

                     />
                     <input
                        name="otp4"
                        type="text"
                        autoComplete="off"
                        className="otpInput"
                        value={state.otp4}
                        onChange={e => handleChange("otp4", e)}
                        tabIndex="4" maxLength="1" onKeyUp={e => inputfocus(e)}
                     />
                  </div>
                  {/* <TextInput
                  value={otp}
                  type='text'
                  placeholder='code'
                  onChange={(e) => setOtp(e.target.value)} /> */}
                  <div>
                     <div>
                        <Button text='Next' />
                     </div>
                     <p className={styles.bottomParagraph}>
                        By entering your email, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
                     </p>
                  </div>
               </Card>
            </div>
         </form>
      </>
   )
}

export default StepOtp