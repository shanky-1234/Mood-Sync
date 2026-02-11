    import {createSlice} from '@reduxjs/toolkit'

    const initialState = {
        backgrounds:'clouds'
    }

    export const backgroundSlice = createSlice({
        name:'background',
        initialState,
        reducers:{
            setBackground:(state,action)=>{
                state.backgrounds = action.payload
            },

        }
    })

    export const {setBackground} = backgroundSlice.actions
    export default backgroundSlice.reducer