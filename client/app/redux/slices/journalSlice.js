const { createSlice } = require("@reduxjs/toolkit")

const initialState= {
    journalInfo:null
}

export const journalSlice = createSlice({
    name:'journal',
    initialState,
    reducers:{
        setJournalInfo:(state,action)=>{
            state.journalInfo = action.payload
        }
    }
})

export const {setJournalInfo} = journalSlice.actions
export default journalSlice.reducer