import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "./slices/authSlice";
import checkInSlice from './slices/checkinSlice'

const store = configureStore({
    reducer:{
        auth:authSlice,
        checkIn:checkInSlice
    }
})

export default store