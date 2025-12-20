const { updateJournal } = require("../Controller/journalController")

// For Mood Calculation
const calculateMoodScore = (moodSlider)=>{
    const score = moodSlider * 100
    return Math.round(score)
}

// For Energy Calculation
const calculateEnergyScore = (energySlider) =>{
    const score = energySlider *100
    return Math.round(score)
}

// For Exp Calculation 
const calculateCheckInExp = (checkInData, currentStreak) =>{
    let exp = 25
    exp += currentStreak*2

    if(checkInData.notes && checkInData.notes.trim().length > 10){
        exp+= 5
    }
    if(checkInData.causes && checkInData.causes.length >=3){
        exp+=5
    }
    if(checkInData.emotion && checkInData.emotion.length >=3){
        exp+=5
    }
    if(checkInData.causesCustom && checkInData.emotionCustom){
        exp+=5
    }

    return exp
}

// Calculate Journal Exp
const calculateJournalExp = (journal,currentStreak) =>{
    let exp=20
    exp += currentStreak *2

    const wordCount = journal.content.trim().split(/\s+/).filter(w=>w.length >0).length
    const contentBonus = Math.min(Math.floor(wordCount / 50),15)
    exp+=contentBonus

    if(journal.title.trim().length > 10){
        exp += 5
    }

    return exp
}

// Exp required to next level
const calculateExpToNextLevel = (currentLevel) =>{
    if(currentLevel === 1) return 100; // first level requires 100 exp
    return currentLevel * 100;
}

// Level-up logic
const updateLevel = (user) =>{
    let leveledUp = false

    while (user.currentExp >= calculateExpToNextLevel(user.currentLvl)) {
        const expNeeded = calculateExpToNextLevel(user.currentLvl);
        user.currentExp -= expNeeded;
        user.currentLvl += 1;
        leveledUp = true;
    }
    return leveledUp
}

// Streak logic
const updateStreaks = (user)=>{
    const today = new Date()
    today.setHours(0,0,0,0)

    if (!user.streaks.lastDate) {
        user.streaks.current = 0;   
        user.streaks.longest = 0;
        user.streaks.lastDate = today;
        return { increased: true, broken: false };
    }

    const lastDate = new Date(user.streaks.lastDate)
    lastDate.setHours(0,0,0,0)  

    const dayGap = Math.floor((today - lastDate) / (1000*60*60*24));

    if(dayGap===0){
        return {increased:false, broken:false }
    }
    else if(dayGap === 1){
        user.streaks.current +=1    

        if (user.streaks.current > user.streaks.longest) {
            user.streaks.longest = user.streaks.current;
        }
        user.streaks.lastDate = new Date()
        return {increased:true,broken:false}
    }
    else{ // if missed
        user.streaks.current = 1
        user.streaks.lastDate = new Date()  
        return {increased:false,broken:true}
    }
}

module.exports = {
    calculateCheckInExp,
    calculateEnergyScore,
    calculateExpToNextLevel,
    calculateJournalExp,
    calculateMoodScore,
    updateLevel,
    updateStreaks,
    updateJournal
}