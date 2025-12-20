import { createContext, useContext, useState } from "react";

const StoredCheckIn = createContext()

export const StoredCheckInProvider = ({children}) =>{
    const [checkInResult,setCheckInResult] = useState(null)
    return(
        <StoredCheckIn.Provider value={{checkInResult,setCheckInResult}}>
            {children}
        </StoredCheckIn.Provider>
    )
}

export const useStoredCheckIn = () =>{
    return useContext(StoredCheckIn)
}