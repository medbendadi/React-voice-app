import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import styles from './InputPhone.css'
const InputPhone = ({ ...props }) => {
   return (
      <div className='PhoneInputCotainer'>
         <PhoneInput
            country='ma'
            {...props}
         />
      </div>
   )
}

export default InputPhone