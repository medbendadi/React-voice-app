import axios from 'axios';

const api = axios.create({
   baseURL: process.env.REACT_APP_API,
   withCredentials: true,
   headers: {
      // 'Content-type': 'application/json',
      Accept: 'application/json',
   },
});

api.defaults.withCredentials = true
axios.defaults.withCredentials = true

// List of all the endpoints
export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (data) => api.post('/api/activate', data);
export const update = (userId, data) => api.post(`/api/users/update/${userId}`, data);
export const logout = () => api.post('/api/logout');
export const createRoom = (data) => api.post('/api/rooms', data);
export const createPrivateRoom = (data) => api.post('/api/rooms/private', data);
export const getAllRooms = () => api.get('/api/rooms');
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);
export const getPrivateRoom = (roomId, data) => api.post(`/api/rooms/private/${roomId}`, data);
export const closeRoom = (roomId) => api.delete(`/api/rooms/${roomId}`);
// export const closeRoom = (roomId) => api.delete(`/api/rooms/${roomId}`);

// Interceptors
api.interceptors.response.use(
   (response) => {
      return response;
   },
   async (error) => {
      if (error.response.status === 401) {
         await axios
            .get(`${process.env.REACT_APP_API}/api/refresh`, {
               withCredentials: true,
            })
            .catch((err) => {
               return Promise.reject(err);
            });
         console.log(error.config);
         return axios.request(error.config); // here error throwing while invoking the actually failed API
      } else {
         return Promise.reject(error);
      }
   }
);
export default api;
