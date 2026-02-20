const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        trim:true
    },
    age:{
        type:Number,
        min:13,
        max:80
    },
    gender:{
        type:String,
        enum:['male','female','other'],
    },
    email:{
        type:String,
        required:true,
        unique:[true,'The user with the email already exists!'],
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        trim:true
    },
    password:{
        type:String,
        minlength:6
    },
    googleId:{
        type:String,
        unique:true,
    },
    googleEmail:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String,
    },
    isVerified: {
    type: Boolean,
    default: false,
},
emailVerificationToken: {
    type: String,
},
emailVerificationExpires: {
    type: Date,
},
resetPassword:{
    type:String,

},
resetPasswordExpires: {
    type: Date,
},
    // Related to Gamification
    streaks:{
        current:{type:Number,default:0},
        longest:{type:Number,default:0},
        lastDate:{type:Date,default:null},
    },
    currentExp:{
        type:Number,
        default:0,
        min:0
    },
    maxExp:{
        type:Number,
        default:100
    },
    currentLvl:{
        type:Number,
        default:1,
        min:1
    },
    longestStreaks:{
        type:Number,
        default:0,
        min:0
    },

    //Related to Check Ins
    totalCheckIns:{
        type:Number,
        default:0,
        min:0
    },
    totalJournals:{
        type:Number,
        default:0,
        min:0
    },
    lastCheckIn:{
        type:Date,
        default:null,
    },
    lastJournal:{
        type:Date,
        default:null
    },
    lastMoodScore:{
        type:Number,
        default:null,
        min:0,
        max:100
    },
    lastEnergyScore:{
        type:Number,
        default:null,
        min:0,
        max:100
    },
    lastSolution:{
        type:String,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    //More to be added

},{timestamps:true})

module.exports = mongoose.model('User',UserSchema)