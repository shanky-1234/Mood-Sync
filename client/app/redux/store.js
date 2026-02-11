import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "./slices/authSlice";
import checkInSlice from './slices/checkinSlice'
import journalSlice from './slices/journalSlice'
import audioSlice from './slices/audioSlice'
import backgroundSlice from './slices/backgroundSlice'

const store = configureStore({
    reducer:{
        auth:authSlice,
        checkIn:checkInSlice,
        journal:journalSlice,
        audio:audioSlice,
        backgrounds:backgroundSlice
    }
})

export default store