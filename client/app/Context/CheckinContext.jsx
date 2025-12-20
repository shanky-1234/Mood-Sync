import { useReducer } from "react"
import { createContext } from "react"

const { useContext } = require("react")

const initialState = {
    moodScore:0.5,
    energyScore:0,
    causes:[],
    emotions:[],
    notes:'',
    causesCustom:'',
    emotionCustom:''
}

const CheckInContext = createContext()

const reducer = (state,action) =>{
    if(action.type === "UPDATE_STEP1_MOOD") return {...state,moodScore:action.payload}
    else if(action.type === "UPDATE_STEP2_ENERGY") return {...state,energyScore:action.payload}
    else if(action.type === "UPDATE_STEP3_CAUSES") return {...state,causes:action.payload}
    else if(action.type === "UPDATE_STEP3_CAUSECUSTOM") return {...state,causesCustom:action.payload}
    else if(action.type === "UPDATE_STEP4_EMOTION") return {...state,emotions:action.payload}
    else if(action.type === "UPDATE_STEP4_EMOTIONCUSTOM") return {...state,emotionCustom:action.payload}
    else if(action.type === "UPDATE_STEP5_NOTES") return {...state,notes:action.payload}
    else return state
}

export const CheckInContextProvider = ({children})=>{
    const [state,dispatch] = useReducer(reducer,initialState)
    return(
        <CheckInContext.Provider value={{state,dispatch}}>
            {children}
        </CheckInContext.Provider>
    )
}

export const useCheckIn = ()=>{
    return useContext(CheckInContext)
}