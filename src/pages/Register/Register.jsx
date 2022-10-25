import React, { useState } from 'react'
import StepAvatar from '../Steps/StepAvatar/StepAvatar'
import StepName from '../Steps/StepName/StepName'
import StepOtp from '../Steps/StepOtp/StepOtp'
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail'
import StepUsername from '../Steps/StepUsername/StepUsername'

import styles from './Register.module.css'

const steps = {
   1: StepPhoneEmail,
   2: StepOtp,
   3: StepName,
   4: StepAvatar,
   5: StepUsername
}

const Register = () => {
   const [step, setStep] = useState(1)
   const Step = steps[step]

   const onNext = () => {
      if (step === 5) {
         return alert('finished')
      }
      setStep(prevent => prevent + 1)
   }

   return (
      <div>
         <Step onNext={onNext} />
      </div>
   )
}

export default Register