import React, { useEffect, useState } from 'react'
import Button from '../../../components/Shared/Button/Button'
import Card from '../../../components/Shared/Card/Card'
import { useDispatch, useSelector } from 'react-redux'
import { setAvatar } from '../../../app/activateSlice'
import { activate } from '../../../http'
import { setAuth } from '../../../app/authSlice'


import styles from './StepAvatar.module.css'
import { toast } from 'react-toastify'
import Loader from '../../../components/Shared/Loader/Loader'

const StepAvatar = () => {
   const dispatch = useDispatch()
   const { name, avatar } = useSelector(state => state.activate)
   const [image, setImage] = useState('/images/default.png')
   const [loading, setLoading] = useState(false)
   const [unMounted, setUnMounted] = useState(false)

   function imageChange(e, img = false) {
      if (!img) {
         const file = e.target.files[0];
         const reader = new FileReader()
         reader.readAsDataURL(file)
         reader.onload = function () {
            setImage(reader.result)
            dispatch(setAvatar(reader.result))
         }
      } else {
         setImage(process.env.REACT_APP_DEFAULT_IMAGE_URL)
         dispatch(setAvatar(process.env.REACT_APP_DEFAULT_IMAGE_URL))
      }
   }

   async function submit(e) {
      e.preventDefault()
      if (!(name || avatar)) return toast.error('Invalid Photo')
      setLoading(true)
      let currentAvatar;
      if (image === '/images/default.png') {
         // imageChange('', true)
         currentAvatar = process.env.REACT_APP_DEFAULT_IMAGE_URL + process.env.REACT_APP_DEFAULT_IMAGE_URL
      }

      try {
         const { data } = await activate({ name, avatar: currentAvatar || avatar })
         if (data.auth) {
            if (!unMounted) {
               setTimeout(() => {
                  dispatch(setAuth(data))
                  setLoading(false)
               }, 3000);
            }
         }

      } catch (err) {
         toast.error(err.message)
      }
   }


   useEffect(() => {
      return () => {
         setUnMounted(true)
      }
   }, [])

   if (loading) return <Loader message="Activation in progress..." />
   return (
      <>
         <form onSubmit={submit}>
            <Card title={`Okay, ${name} !`} icon='mail-icon'>
               <p className={styles.subHeading}>Let's Select A Photo</p>
               <div className={styles.avatarWrapper}>
                  <img src={image} alt="Avatar" />
               </div>
               <div>
                  <input
                     onChange={(e) => imageChange(e)}
                     id='avatarInput'
                     type="file"
                     className={styles.avatarInput}
                     accept=".png, .jpg, .jpeg"
                  />
                  <label
                     className={styles.avatarLabel}
                     htmlFor="avatarInput"
                  >
                     Choose a different photo
                  </label>
               </div>
               <div>
                  <Button text='Next' />
               </div>
            </Card>
         </form>
      </>
   )
}

export default StepAvatar