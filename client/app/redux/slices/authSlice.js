import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated:false,
    isLoading:true,
    userInfo:null,
    userToken:null,
    isError:null
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        setError:(state,action)=>{
            state.isError=action.payload
        },
        setUser:(state,action)=>{
            state.userInfo=action.payload
        },
        setToken:(state,action)=>{
            state.userToken = action.payload
        },

    }
})

export const {setLoading,setError,setUser,setToken} = authSlice.actions
export default authSlice.reducer