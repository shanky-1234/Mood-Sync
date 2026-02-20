const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const userModel = require('../Models/user-model')
const {OAuth2Client} = require('google-auth-library')
const crypto = require('crypto')
const sendMail = require('../utils/mailer')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
require('dotenv').config()

const googleAuth = async (req,res) =>{
    try{
        const {googleId, email, fullname, age, gender} = req.body
        let user = await userModel.findOne({googleId})
        if(user){
             const token={
        userId:user._id,
        email:user.email,
    }
    const generate = jwt.sign(token,process.env.JWTSECUREKEY,{expiresIn:'2d'})
    return res.status(200).json({
        success:true,
        message:'Succesfully Logged In From Google',
        googleSignIn:true,
        generate,
        user,
        needsExtraInfo:false
    })
        }
        if(!age || !gender){
            return res.status(200).json({
                success:false,
                needsExtraInfo:true,
                message:'Field Missing',
                user:{
                    googleId,fullname,email
                }
            })
        }
        user = await userModel.findOne({
            email
        })
        if(user){
            user.googleId = googleId
            user.googleEmail = email
            user.isVerified = true
            await user.save()
        }
        else{
             user = await userModel.create({
  googleId, email, fullname, age, gender, password: null,isVerified:true
});
        }
             const token={
        userId:user._id,
        email:user.email,
    }
    const generate = jwt.sign(token,process.env.JWTSECUREKEY,{expiresIn:'2d'})
    return res.status(200).json({
        success:true,
        message:'Succesfully Logged In From Google',
        googleSignIn:true,
        generate,
        user,
        needsExtraInfo:false
    })
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

    

    const emailVerificationToken = crypto.randomInt(10000,100000).toString()
    const emailVerificationExpires = Date.now() + 24*60*60*1000

    // const verificationLink = `http://localhost:3000/verify-email?token=${emailVerificationToken}`;

    await sendMail({
        to:email,
        subject:'Verification Code - Mood Sync',
        html:`
        <h1>Welcome to MoodSync</h1>
        <p>Hi ${fullname},</p>
           <p>Thanks for signing up! Please verify your email by clicking the link below:</p>
           <h2>${emailVerificationToken}</h2>
           <p>This link will expire in 24 hours.</p`
    })

    // Create New Password
    const registerNewUser = await userModel.create({
        fullname,
        age,
        gender,
        email,
        password:generateEncrptPassword,
        isVerified:false,
        emailVerificationToken,
        emailVerificationExpires
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

const verifyEmail = async(req,res)=>{
    try {
        const {email,code} = req.body
        
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:'No Email Found'
            })
        }

        if (user.isVerified) {
            return res.status(400).json({success:false, message: 'Already verified' });
        }

         if (user.emailVerificationExpires < Date.now()) return res.status(400).json({ message: 'Code expired' });
        if (user.emailVerificationToken !== code) return res.status(400).json({ message: 'Invalid code' });

        user.isVerified = true
        user.emailVerificationExpires = undefined
        user.emailVerificationToken = undefined

        await user.save()

        return res.status(200).json({
            success:true,
            message:'Email Successfully Verified welcome to moodsync'
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
    }
}

const changePassword = async(req,res)=>{
    try {
        const {password} = req.body
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
        }
        if(!password){
            return res.status(400).json({
                success:false,
                message:'Nothing Detected'
            })
        }
        const decoded = jwt.verify(token, process.env.JWTSECUREKEY);
        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:'No user foun permission denied'
            })
        }

        user.password = password
        user.resetPassword = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return res.status(200).json({
            success:true,
            message:'Password Successfully Changed!'
        })

    } catch (error) {
        console.error(error)
         return res.status(500).json({
            success:false,
            message:'Internal Server Error'
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

    if(!getUser?.isVerified){
        return res.status(400).json({
            success:false,
            message:"Account Not Verified"
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

const changePasswordRequest = async(req,res)=>{
    try{
        const {email} = req.body
         //Check if user already exists
    const getUserEmail = await userModel.findOne({email})

    if (!getUserEmail){
        return res.status(404).json({
            success:false,
            message:"User Email Not found"
        })
    }
    const resetPassword = crypto.randomInt(10000,100000).toString()
    const resetPasswordExpires = Date.now() + 24*60*60*1000

    await sendMail({
        to:email,
        subject:'Verification Code - Mood Sync',
        html:`
        <h1>Welcome to MoodSync</h1>
        <p>Hi ${getUserEmail.fullname},</p>
           <p>Change your password by verifying the code below</p>
           <h2>${resetPassword}</h2>
           <p>This link will expire in 24 hours.</p>`
    })
    getUserEmail.resetPassword = resetPassword
    getUserEmail.resetPasswordExpires = resetPasswordExpires
    await getUserEmail.save()

    return res.status(200).json({
        success:true,
        message:'Email Code Sent'
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

const verifyCodePassword = async(req,res)=>{
    try {
          const {email,code} = req.body
        
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:'No Email Found'
            })
        }

         if (user.resetPasswordExpires < Date.now()) return res.status(400).json({ message: 'Code expired' });
        if (user.resetPassword !== code) return res.status(400).json({ message: 'Invalid code' });

        const resetToken = jwt.sign({ id: user._id },
  process.env.JWTSECUREKEY,
  { expiresIn: "10m" }
)



        return res.status(200).json({
            success:true,
            message:'Email Successfully Verified Can Change Password',
            resetToken
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

module.exports = {login,registerUser,logout,getUserData,googleAuth,verifyEmail,changePasswordRequest,verifyCodePassword,changePassword}
