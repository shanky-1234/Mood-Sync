const mongoose = require('mongoose')
const GamificationSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },

    activityType:{
        type:String,
        enum:['checkin','journal'],
        required:true,
        index:true
    },

    sourceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'activityType',
        required:true
    },

    expEarned:{
        type:Number,
        required:true,
        min:0
    },

    useStateActivity:{
        level:{
            type:Number,
            required:true
        },
         totalExp: {
            type: Number,
            required: true
        },
        totalStreak:{
            type:Number,
            default:0
        }
    },
    levelUp:{
        type:Boolean,
        default:false
    },
    newLevel:{
        type:Number
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    }
},{timestamps:true})

GamificationSchema.index({userId:1,timestamp:-1})
GamificationSchema.index({userId:1,activityType:-1})

module.exports = mongoose.model('Gamification',GamificationSchema)