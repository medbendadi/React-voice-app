import { configureStore } from '@reduxjs/toolkit';

import auth from './authSlice';
import rooms from './roomsSlice';
import activate from './activateSlice';
export const store = configureStore({
   reducer: {
      auth,
      activate,
      rooms
   },
   devTools: false
})