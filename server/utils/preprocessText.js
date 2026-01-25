const preProcessText = (rawJournal) =>{
    if(typeof rawJournal !== "string" || !rawJournal){
        console.error('Invalid Input')
        return
    }


    let journalText = rawJournal

    journalText = journalText.trim()
    journalText = journalText.replace(/\s+/g, " ") // Replace Multiple spaces with single space 
    return journalText

}

module.exports = {preProcessText}