import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../../components/Shared/Card/Card'
import { FilePlus } from 'react-feather';

import styles from './Profile.module.css'
import TextInput from '../../components/Shared/TextInput/TextInput';
import { setAvatar } from '../../app/activateSlice';
import { toast } from 'react-toastify';
import { setAuth } from '../../app/authSlice';
import { update } from '../../http';

const initial = {
   name: '',
   image: '',
}

const Profile = () => {
   const { user } = useSelector(state => state.auth);
   const [state, setState] = useState(initial)
   const { name, image } = state;
   const [imageUpload, setImageUpload] = useState('')
   const dispatch = useDispatch()
   const [unMounted, setUnMounted] = useState(false)
   const toastId = React.useRef(null);

   useEffect(() => {
      setState({ ...state, 'name': user.name, 'image': user.avatar })
   }, [])

   const handleChange = (e) => {
      let { name, value } = e.target;
      setState({ ...state, [name]: value })
   }

   function imageChange(e, img = false) {
      const file = e.target.files[0];
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
         console.log(reader.result);
         setState({ ...state, image: reader.result })
         // setImage(reader.result)
      }
   }
   async function submit() {
      if (!(name || image)) return toast.error('Invalid Photo Or name')
      toastId.current = toast.loading('Updating')
      try {
         const { data } = await update(user.id, { name: name || user.name, avatar: image === user.avatar ? 'lastImage' : image })
         if (data.auth) {
            if (!unMounted) {
               setTimeout(() => {
                  console.log(data);
                  dispatch(setAuth(data))
                  toast.dismiss(toastId.current)
               }, 3000);
            }
         }

      } catch (err) {
         toast.dismiss(toastId.current)
         toast.error(err.message)
      }
   }


   useEffect(() => {
      return () => {
         setUnMounted(true)
      }
   }, [])


   return (
      <div className='container'>
         <Card style={{ width: '100%', maxWidth: '100%', display: 'initial' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>My Profile</h1>
            <div className={styles.container}>
               <div className={styles.imageContainer}>
                  <div className={styles.image}>
                     <img
                        src={image || user.avatar}
                        alt="profile"
                     />
                     <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => imageChange(e)}
                     />
                     <div></div>
                     <FilePlus size={40} />
                     {/* <i className='bx bx-image-add'></i> */}
                  </div>
               </div>
               <div className={styles.contentContainer}>
                  <div>
                     <label htmlFor="name">Name</label>
                     <TextInput
                        fullwidth='true'
                        placeholder='Name'
                        id='name'
                        value={name}
                        onChange={handleChange}
                        name='name'
                     />
                  </div>
                  <div>
                     <label htmlFor="phone">Phone Number</label>
                     <TextInput
                        fullwidth='true'
                        placeholder='Phone Number'
                        id='phone'
                        value={`+${user.phone}`}
                        disabled
                     />
                  </div>
                  <button className={styles.button} onClick={submit}>Update</button>
               </div>
            </div>
         </Card>
      </div>
   )
}

export default Profile