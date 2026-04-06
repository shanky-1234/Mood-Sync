const express = require('express')
const connectToDB = require('./Database/database')
const cors = require('cors')
require('dotenv').config()


const userRouter = require('./Routes/authRoutes')
const notiRouter = require('./Routes/notiRoutes')
const {startJournalReminderJob} = require('./jobs/journalReminderJob')
const {startStreakReminderJob} = require('./jobs/streakReminderJob')
const {startCheckInReminderJob} = require('./jobs/checkInReminderJob')
const journalRouter = require('./Routes/journalRoutes')
const checkInRouter = require('./Routes/checkInRoutes')
const streakRouter = require('./Routes/streakRoutes')
const rewardRouter = require('./Routes/dailyRewardRoute')

const app=express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3000

startStreakReminderJob();
startJournalReminderJob();
startCheckInReminderJob()


app.use('/api/v1/auth/',userRouter)
app.use('/api/v1/noti',notiRouter)
app.use('/api/v1/journal/',journalRouter)
app.use('/api/v1/checkIn/',checkInRouter)
app.use('/api/v1/streaks/',streakRouter)
app.use('/api/v1/rewards/',rewardRouter)



app.listen(port,()=>{
    console.log(`Server Connected to Port ${port}`)
    connectToDB()
})