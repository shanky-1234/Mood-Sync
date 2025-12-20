const { createSlice } = require("@reduxjs/toolkit")

const initialState= {
    checkInInfo:null
}

export const checkInSlice = createSlice({
    name:'checkIn',
    initialState,
    reducers:{
        setCheckInInfo:(state,action)=>{
            state.checkInInfo = action.payload
        }
    }
})

export const {setCheckInInfo} = checkInSlice.actions
export default checkInSlice.reducer