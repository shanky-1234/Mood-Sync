const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const userModel = require('../Models/user-model')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
require('dotenv').config()

const googleAuth = async (req,res) =>{
    try{
        const {token} = req.body

        if(!token){
            return res.status(400).json({
                success:false,
                message:'Missing Google Token'
            })
        }

        //Verifying Google Token 
        const ticket = await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        const {sub,email,name} = payload

        const user = await userModel.findOne({email})
        if(!user){
            user = await userModel.create({
                fullname:name,
                email,
                googleId:sub,
            })
        }

        const tokens={
        userId:getUser._id,
        email:getUser.email,
    }

        const generate = jwt.sign(tokens,process.env.JWTSECUREKEY,{expiresIn:'1d'})
         return res.status(200).json({
      success: true,
      message: `Google login successful! Welcome ${user.fullname}`,
      generate,
      user,
    });
    }
    catch(error){
         return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error.message,
    });
    }
}

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
        email:getUser.email,
    }

    const generate = jwt.sign(token,process.env.JWTSECUREKEY,{expiresIn:'2d'})
    return res.status(200).json({
        success:true,
        message:`Logged In Sucessfully, Welcome ${getUser.fullname}`,
        getUser,
        generate
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

const getUserData = async (req,res)=>{
    try{
        const userData = await userModel.findById(req.user.userId)
        if(!userData){
            return res.status(403).json({
            success:false,
            message:'Invalid Token'
        })
        }
        return res.status(200).json({
            success:true,
            message:'Successfully Verified',
            userData
        })
    }
    catch(error){
        console.error(error)
    }
}

const logout =(req,res)=>{
    try{
            return res.status(200).json({
                 success:true,
            message:"Logout Suceessfully",
            })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
}

module.exports = {login,registerUser,logout,getUserData,googleAuth}
