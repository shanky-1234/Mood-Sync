const express = require('express')
const connectToDB = require('./Database/database')
const cors = require('cors')
require('dotenv').config()

const userRouter = require('./Routes/authRoutes')

const app=express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT

app.use('/api/v1/auth/',userRouter)



app.listen(port,()=>{
    console.log(`Server Connected to Port ${port}`)
    connectToDB()
})