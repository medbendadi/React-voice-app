import axios from 'axios';
const api = axios.create({
   baseURL: process.env.REACT_APP_API,
   headers: {
      // 'content-type': 'application/json',
      Accept: 'application/json',
   }
})


// EndPoints List:

export const sendOtp = (obj) => api.post('/api/send-otp', obj)
export const verifyOtp = (data) => api.post('/api/verify-otp', data)



export default api;