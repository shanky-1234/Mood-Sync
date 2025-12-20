const userModel = require("../Models/user-model")
const { checkStreak } = require("../utils/streaks")

const streakController = async (req,res) =>{
    try {
        const getUserId = await userModel.findById(req.user.userId).select('streaks')

        if(!getUserId){
            return res.status(404).json({
                success:false,
                message:'User Not Found'
            })
        }

        const streak = checkStreak(getUserId.streaks)

        return res.status(200).json({
            success:true,
            streak
        })

    } catch (error) {
         console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get streak status'
    })
    }
}

module.exports = {streakController}