const mongoose = require('mongoose')

const JournalSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    title:{
        type:String,
        required:[true,'Title is Required'],
        trim:true,
        maxLength:[100,'Max Number of Title']
    },
    content:{
        type:String,
        default:''
    },
    photos:[
        {
            url:{
                type:String,
            },
            publicId:{
                type:String
            },
                uploadedAt:{
                type:Date,
                default:Date.now
            }
        }
    ],
    color:{
        type:String,
        default:'#DE4742',
        trim:true,
    },
    status:{
      type:String,
      enum:['draft','inProgress','analysisCompleted','analyzing'],
      default:'draft'
    },
     expEarned: {
        type: Number,
        default: 0,
        min: 0
    },
     createdAt:{
        type:Date,
        default:Date.now
    },
    analysis:{
        emotion:{
            type: [String],
            default:[]
        },
        causes:{
            type:[String],
            default:[]
        },
        scores:{
            moodScore:{
                type:Number,
                min:0,
                max:100,
                default:50,
            },
            energyScore:{
                type:Number,
                min:0,
                max:100,
                default:50
            },
            stressScore:{
                type:Number,
                min:0,
                max:100,
                default:50
            }

        },
        solution:{
            type:String,
            default:''
        },
        analysisDate:{
            type:Date,
            default:Date.now,
        },
        modelMeta:{
            emotionModel:String,
            reasoningModel:String
        }

    }
    //More to be added
},{timestamps:true})

module.exports = mongoose.model('Journal',JournalSchema)