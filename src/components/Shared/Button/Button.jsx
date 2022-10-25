import React from 'react'


import styles from './Button.module.css'
const Button = ({ text, onClick }) => {
   return (
      <button onClick={onClick} className={styles.button}>
         <span>
            {text}
         </span>
         <img
            src="/images/arrow-forword.png"
            alt="next" />
      </button>
   )
}

export default Button