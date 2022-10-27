import React, { useState } from 'react'
import StepOtp from '../Steps/StepOtp/StepOtp'
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail'

const steps = {
   1: StepPhoneEmail,
   2: StepOtp,
}

const Authenticate = () => {
   const [step, setStep] = useState(1)
   const Step = steps[step]

   const onNext = () => {
      if (step === 2) {
         return alert('finished')
      }
      setStep(prevent => prevent + 1)
   }
   return (
      <Step onNext={onNext} />
   )
}

export default Authenticate