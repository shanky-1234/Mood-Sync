const checkStreak = (streaks) =>{
    const today = new Date()
    today.setHours(0,0,0,0)

    if(!streaks.lastDate){
        return {
            current:0,
            broken:false
        }
    }

    const last = new Date(streaks.lastDate)
    last.setHours(0,0,0,0)

    const diffDay = Math.floor(
        (today-last) / (1000*60*60*24)
    )

    if(diffDay > 1){
        return{
            current:0,
            broken:true
        }
    }

    return {
    current: streaks.current,
    broken: false
  }
}

module.exports = {checkStreak}