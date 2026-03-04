const mongoose = require('mongoose')

const DailyRewardPoolSchema = new mongoose.Schema({
    actionType:{
        type:String,
        enum:['checkin','journal','streak'],
        required:true
    },
    targetCount:{
        type:Number,
    },
    minTarget: Number,
  maxTarget: Number,
    expReward:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model("DailyRewardPool",DailyRewardPoolSchema)