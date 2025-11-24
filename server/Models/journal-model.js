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
    color:{
        type:String,
        default:'#DE4742',
        trim:true,
    },
    status:{
      type:String,
      enum:['draft','inProgress','analysisCompleted'],
      default:'draft'
    },
     createdAt:{
        type:Date,
        default:Date.now
    },
    //More to be added
},{timestamps:true})

module.exports = mongoose.model('Journal',JournalSchema)