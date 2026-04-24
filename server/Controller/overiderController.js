const userModel = require("../Models/user-model")

const controlOveride = async(req,res)=>{
    try {
        const userId = req.user.userId
        if (!userId){
            return res.status(400).json({
                success:false,
                message:'User not Detected'
            })
        }

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const user = await userModel.findByIdAndUpdate(userId, 
            {
            mascotOveride:{
                mode:'angry',
                source:'anger_release',
                expiresAt
            }
        }
        )

        return res.status(200).json({
            success: true,
            message:"Anger Mode Activated",
            user
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = controlOveride