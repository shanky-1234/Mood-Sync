const mongoose = require('mongoose')

const DailyRewardSchema = new mongoose.Schema({
    user:{
         type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true,
                index:true
    },
    reward:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyRewardPool"
    },
    date:{
        type:Date, 
    },
    required:{
        type:Number,
        required:true
    },
    progress:{
        type:Number,
        default:0
    },
    claimed:{
        type:Boolean,
        default:false
    }
})
DailyRewardSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('DailyReward',DailyRewardSchema)