import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "./slices/authSlice";
import checkInSlice from './slices/checkinSlice'
import journalSlice from './slices/journalSlice'
import audioSlice from './slices/audioSlice'
import backgroundSlice from './slices/backgroundSlice'
import dailyRewardSlice from './slices/rewardsSlice'

const store = configureStore({
    reducer:{
        auth:authSlice,
        checkIn:checkInSlice,
        journal:journalSlice,
        audio:audioSlice,
        backgrounds:backgroundSlice,
        dailyReward:dailyRewardSlice
    }
})

export default store