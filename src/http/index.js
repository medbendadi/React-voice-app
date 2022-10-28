import axios from 'axios';
const api = axios.create({
   baseURL: process.env.REACT_APP_API,
   withCredentials: true,
   headers: {
      // 'content-type': 'application/json',
      Accept: 'application/json',
   }
})


// EndPoints List:

export const sendOtp = (obj) => api.post('/api/send-otp', obj)
export const verifyOtp = (data) => api.post('/api/verify-otp', data)
export const activate = (data) => api.post('/api/activate', data)
export const logout = (data) => api.post('/api/logout')



// interceptors


api.interceptors.response.use(
   (config) => {
      return config;
   },
   async (error) => {
      const originalRequest = error.config;
      if (
         error.response.status === 401 &&
         originalRequest &&
         !originalRequest._isRetry
      ) {
         originalRequest.isRetry = true;
         try {
            axios.get(
               `${process.env.REACT_APP_API}/api/refresh`,
               {
                  withCredentials: true,
               }
            ).then((res) => {
               if (res) {
                  return api.request(originalRequest);
               }
            })

         } catch (err) {
            console.log(err.message);
         }
      }
      throw error;
   }
);


function sendWithRetry() {
}



export default api;