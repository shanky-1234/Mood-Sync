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
        sparse:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

    //More to be added

},{timestamps:true})

module.exports = mongoose.model('User',UserSchema)