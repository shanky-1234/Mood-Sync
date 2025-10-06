const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const userModel = require('../Models/user-model')
require('dotenv').config()


const registerUser = async (req,res) =>{
    try{
        const {fullname,age,gender,email,password} = req.body

    // Check Empty Fields
    if(!fullname || !age || !gender || !email || !password ) {
        return res.status(400).json({
            success:false,
            message:"Empty Fields"
        })
    }

    //Check if user already exists
    const getUserEmail = await userModel.findOne({email})

    if (getUserEmail){
        return res.status(400).json({
            success:false,
            message:"User Already Exsists,Try another Email"
        })
    }
      // Encrypt the password

    const salt = await bycrypt.genSalt(10)
    const generateEncrptPassword = await bycrypt.hash(password,salt)

    // Create New Password
    const registerNewUser = await userModel.create({
        fullname,
        age,
        gender,
        email,
        password:generateEncrptPassword
    })

    if(!registerNewUser){
        return res.status(403).json({
            success:false,
            message:"Some Error Occured"
        })
    }

    return res.status(200).json({
        success:true,
        message:"User Created Successfuly!",
        data:{id: registerNewUser._id,
                fullname: registerNewUser.fullname,
                email: registerNewUser.email}
        
    })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
}

const login = async(req,res)=>{
    try {
         const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Field Are Empty"
        })
    }

    // Check credential 
    const getUser = await userModel.findOne({email})
    if(!getUser){
        return res.status(403).json({
            success:false,
            message:"Invalid Email or Password"
        })
    }

    const compare = await bycrypt.compare(password,getUser.password)
    if(!compare){
        return res.status(403).json({
            success:false,
            message:"Invalid Email or Password"
        })
    }

    const token={
        userId:getUser._id,
        email,
        password
    }

    const generateToken = await jwt.sign(token,process.env.JWTSECUREKEY,{expiresIn:'7d'})
    return res.status(200).json({
        success:true,
        message:`Logged In Sucessfully, Welcome ${getUser.fullname}`,
        generateToken
    })
    } catch (error) {
           console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
   
}

module.exports = {login,registerUser}