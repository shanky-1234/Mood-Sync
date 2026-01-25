import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StoredJournal = createContext()

export const StoredJournalProvider = ({children}) =>{
    const [journalResult,setJournalResult] = useState(null)
    return(
        <StoredJournal.Provider value={{journalResult,setJournalResult}}>
            {children}
        </StoredJournal.Provider>
    )
}

export const UseStoredJournalData = ()=>{
    return useContext(StoredJournal)
}



