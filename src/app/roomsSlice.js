import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { getAllRooms, createRoom, closeRoom, createPrivateRoom } from "../http";

const initialState = {
   rooms: [],
   status: 'idle',
   error: null,
}

// const baseUrl = `${p}/rooms`


export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
   const res = await getAllRooms();
   return res.data
})

export const addRoom = createAsyncThunk('rooms/addRooms', async (initialTodo) => {
   const response = await createRoom(initialTodo)
   return response.data
})

export const addPrivateRoom = createAsyncThunk('rooms/addRooms', async (initialTodo) => {
   const response = await createPrivateRoom(initialTodo)
   return response.data
})

export const deleteRoom = createAsyncThunk('rooms/deleteRooms', async (id) => {
   const response = await closeRoom(id)
   if (response?.status === 200) return id;
   return `${response?.status}: ${response?.statusText}`;
})

export const roomsSlice = createSlice({
   name: 'rooms',
   initialState,
   reducers: {
      roomsAdded: {
         reducer(state, action) {
            state.rooms.push(action.payload)
         },
         prepare(content) {
            return {
               payload: {
                  id: nanoid(),
                  content,
                  isChecked: false,
                  date: new Date().toISOString(),
               }
            }
         }
      }
   },
   extraReducers(builder) {
      builder
         .addCase(fetchRooms.pending, (state, action) => {
            state.status = 'loading'
         })
         .addCase(fetchRooms.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.rooms = action.payload
         })
         .addCase(fetchRooms.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message + ' code: ' + action.error.code
         })
         .addCase(addRoom.pending, (state, action) => {
            state.status = "loading"
         })
         .addCase(addRoom.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message + ' code: ' + action.error.code
         })
         .addCase(addRoom.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.rooms.push(action.payload)
            // const newPayload = { ...action.payload.test }
            // return newPayload
         })
         .addCase(deleteRoom.fulfilled, (state, action) => {

            if (!action.payload?.id) {
               console.log('Delete could not complete');
               return;
            }
            state.status = "succeeded"
            const { id } = action.payload
            const rooms = state.rooms.filter((item) => item.id !== id)
            state.rooms = [...rooms]
         })
         .addCase(deleteRoom.pending, (state, action) => {
            state.status = "loading"
         })
         .addCase(deleteRoom.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message + ' code: ' + action.error.code
         })

   }
})


export const { roomsAdded } = roomsSlice.actions

export default roomsSlice.reducer
