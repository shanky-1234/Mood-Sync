const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyToken = (req,res,next) =>{
    console.log("JWT Secret (verify):", process.env.JWTSECUREKEY);
    const authHeader = req.headers["authorization"]
    console.log(authHeader)
    if(!authHeader){
        return res.status(401).json({
            success:false,
            messgae:'No Token Provided'
        })
    }

    const token = authHeader.split(" ")[1]
    jwt.verify(token,process.env.JWTSECUREKEY,(err,decoded)=>{
        if (err){
        return  res.status(403).json({
            success:false,
            message:'Invalid Token',
            error:err.message,
        })
        }
        req.user = decoded
        next()
       
    })
}

module.exports = verifyToken