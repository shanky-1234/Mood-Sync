    import {createSlice} from '@reduxjs/toolkit'

    const initialState = {
        isSound:true
    }

    export const audioSlice = createSlice({
        name:'audio',
        initialState,
        reducers:{
            setAudio:(state,action)=>{
                state.isSound = action.payload
            },

        }
    })

    export const {setAudio} = audioSlice.actions
    export default audioSlice.reducer