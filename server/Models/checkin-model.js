const mongoose = require('mongoose')

const CheckInSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },

    //inputdata
        moodSlider:{
            type:Number,
            required:true,
            min:0,
            max:1
        },
        energySlider:{
            type:Number,
            required:true,
            min:0,
            max:1
        },
        causes:{
            type:[String],
            default:[]
        },
        emotion:{
            type:[String],
            default:[]
        },
        causesCustom:{
            type:String,
            default:'',
            trim:true,
            maxLength:100
        },
        emotionCustom:{
             type:String,
            default:'',
            trim:true,
            maxLength:100
        },
        customNotes:{
            type:String,
            default:'',
            trim:true,
            maxLength:200
        },

    //Calculated Score
        moodScore:{
            type:Number,
            required:true,
            min:0,
            max:100
        },
        energyScore:{
            type:Number,
            required:true,
            min:0,
            max:100
        },

        time:{
            type:String,
        },
        day:{
            type:String
        },
        calculationVersion:{ // For Calculating mood scores before integrating AI 
            type:String,
            default:'1.0' // Without AO
        },
         analysis:{
            solution:{ 
                type:String,
                default:''
            },
            analysisDate: {
                type:Date,
                default:Date.now
            },
            modelVersion:{
                type:String,
                default:'mistral'
            } 
        },
        timestamp:{
            type:Date,
            default:Date.now,
            required:true,
            index:true
        },
       
},{timestamps:true})

CheckInSchema.index({userId:1,timestamp:-1})

module.exports = mongoose.model('CheckIn',CheckInSchema)

