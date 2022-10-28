import React, { useState } from 'react'
import Button from '../../../components/Shared/Button/Button'
import Card from '../../../components/Shared/Card/Card'
import TextInput from '../../../components/Shared/TextInput/TextInput'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setName } from '../../../app/activateSlice'

import styles from './StepName.module.css'

const StepName = ({ onNext }) => {
   const { name } = useSelector((state) => state.activate)
   const [username, setUsername] = useState(name)
   const dispatch = useDispatch()
   const nextStep = () => {
      if (!username) {
         return toast.error('Please Enter valid Name')
      }
      dispatch(setName(username))
      onNext()
   }
   return (
      <>
         <Card title='What Should We Call You ? ' icon='mail-icon'>
            <TextInput
               value={username}
               type='text'
               placeholder='Username'
               onChange={(e) => setUsername(e.target.value)} />
            <div>
               <p className={styles.paragraph}>
                  89% of Infinity Community use real names
               </p>
               <div>
                  <Button onClick={nextStep} text='Next' />
               </div>
            </div>
         </Card>
      </>
   )
}

export default StepName