import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "./slices/authSlice";
import checkInSlice from './slices/checkinSlice'
import journalSlice from './slices/journalSlice'

const store = configureStore({
    reducer:{
        auth:authSlice,
        checkIn:checkInSlice,
        journal:journalSlice
    }
})

export default store