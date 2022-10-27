import React from 'react'
import styles from './TextInput.module.css'
const TextInput = ({ ...props }) => {
   return (
      <div>
         <input
            className={styles.input}
            type="text"
            autoFocus
            {...props}
         />
      </div>
   )
}

export default TextInput