import React from 'react';
import styles from './Card.module.css';

const Card = ({ title, icon, children, ...props }) => {
   return (
      <div className={styles.card} {...props}>
         <div className={styles.headingWrapper}>
            {title && <h1 className={styles.heading}>{title}</h1>}
         </div>
         {children}
      </div>
   );
};

export default Card;