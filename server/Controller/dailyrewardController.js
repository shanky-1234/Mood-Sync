const {getOrCreateDailyReward} = require('../Service/dailyRewardService')


const getDailyReward = async(req,res)=>{
    try {
        const userId = req.user.userId
        if(!userId){
            return res.status(404).json({
                success:false,
                message:'No user Found'
            })
        }

        const dailyReward = await getOrCreateDailyReward(userId)
        return res.status(200).json({
            success:true,
            dailyReward,
            message:'Success'
        })
    
    } catch (error) {
         console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}

module.exports = {getDailyReward}