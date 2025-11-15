const express = require('express')
const { registerUser, login,logout, getUserData, googleAuth } = require('../Controller/authController')
const verifyToken = require('../Middleware/user')


const router = express.Router()

router.post('/registerUser',registerUser)
router.post('/login',login)
router.get('/profile',verifyToken,getUserData)
router.post('/logout',logout)
router.get('/verify',verifyToken,(req,res)=>{
    return res.status(200).json({
         success: true,
    message: "Token is valid",
    user: req.user,
    })
})
router.get('/google',googleAuth)


module.exports = router