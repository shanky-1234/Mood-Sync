
const DailyRewardPool = require('../Models/dailyreawardspool-model')
const dailyrewardModel = require('../Models/dailyreward-model')

const getTodayStart = () => {
  const d = new Date()
  d.setHours(0,0,0,0)
  return d
}

const getOrCreateDailyReward = async (userId) =>{
    const today = getTodayStart()

    let existing = await dailyrewardModel.findOne({
        user:userId,
        date:today
    }).populate('reward')

    if(existing) return existing

    const pool = await DailyRewardPool.find({active:true})

    const selected = pool[Math.floor(Math.random()*pool.length)]

    let finalTarget = selected.targetCount

    if(selected.actionType === 'checkin'){
        finalTarget = Math.floor(Math.random()*(selected.maxTarget - selected.minTarget +1)) + selected.minTarget
    }

    const created = await dailyrewardModel.create({
  user: userId,
  reward: selected._id,
  required: finalTarget,
  date: today,
  progress: 0,
  claimed: false,
});
return await created.populate("reward");
}

const updateDailyReward = async(userId,actionType,streakInfo = null)=>{
    const today = getTodayStart()

    const daily = await dailyrewardModel.findOne({
        user:userId,
        date:today
    }).populate('reward')

    if(!daily || daily.claimed){
        return null
    }

    if(daily.reward.actionType === 'streak'){
        if (streakInfo?.increased){
            daily.claimed = true
            await daily.save()
            return daily
        }
        return null
    }

     if (daily.reward.actionType !== actionType) return null

     daily.progress +=1

     if(daily.progress >= daily.required){
        daily.claimed = true
     }

     await daily.save()

     return daily 
}

module.exports = {getOrCreateDailyReward,updateDailyReward}