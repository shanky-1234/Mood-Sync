const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        min:13,
        max:80
    },
    gender:{
        type:String,
        enum:['male','female','other'],
        require:true
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
        required:true,
        minlength:6
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

    //More to be added

},{timestamps:true})

module.exports = mongoose.model('User',UserSchema)