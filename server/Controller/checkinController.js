const checkinModel = require('../Models/checkin-model')
const gamificationModel = require('../Models/gamification-model')
const userModel = require('../Models/user-model')
const { calculateMoodScore, calculateEnergyScore, updateStreaks, calculateCheckInExp, calculateExpToNextLevel, updateLevel } = require('../utils/calculation')

const createCheckIn = async (req,res) =>{
    try{
        const userId = req.user.userId
        const {moodSlider,energySlider,causes,causesCustom,emotion,emotionCustom,notes} = req.body

        if(!userId){
            return res.status(400).json({ success:false, message:"User Not detected" })
        }
        if(!moodSlider || !energySlider || !causes || !emotion){
            return res.status(403).json({ success:false, message:"Fields are missing" })
        }

        const getUser = await userModel.findById(userId)

        const today = new Date()
        const todayDate = new Date(today)
        todayDate.setHours(0,0,0,0)

        // Check if already checked in today
        const checkIfAlreadyCheckedIn = await checkinModel.countDocuments({
            userId:userId,
            timestamp:{$gte:todayDate}
        })
        const firstCheckIn = checkIfAlreadyCheckedIn === 0

        // Calculate Mood & Energy
        const moodScore = calculateMoodScore(moodSlider)
        const energyScore = calculateEnergyScore(energySlider)

        // Update Streak
        let streakInfo = {increased:false,broken:false}
        if(firstCheckIn){
            streakInfo = updateStreaks(getUser)
        }

        const safeCauses = Array.isArray(causes) ? causes : [];
        const safeEmotions = Array.isArray(emotion) ? emotion : [];

        const expEarned = calculateCheckInExp({
            notes,
            causes:safeCauses,
            emotion:safeEmotions,
            causesCustom,
            emotionCustom
        },getUser.streaks.current)

        const beforeData = {
            level:getUser.currentLvl,
            totalExp:getUser.currentExp,
            totalStreak:getUser.streaks.current,
        }

        // Update Exp
        getUser.currentExp += expEarned

        // Check level-up
        const levelUp = updateLevel(getUser)

        // Update user
        getUser.totalCheckIns += 1;
        getUser.lastMoodScore = moodScore;
        getUser.lastEnergyScore = energyScore;
        getUser.lastCheckIn = today;

        await getUser.save();

        const checkInCreate = await checkinModel.create({
            userId,
            timestamp:today,
            moodSlider,
            energySlider,
            moodScore,
            energyScore,
            causes:safeCauses,
            emotion:safeEmotions,
            emotionCustom,
            causesCustom,
            customNotes:notes,
            timeOfDay: today.toTimeString().slice(0,5),
            dayOfWeek: today.toLocaleDateString("en-US",{ weekday:"long" }),
            calculationVersion:"1.0"
        })

        if(!checkInCreate){
            return res.status(400).json({ success:false, message:'Failed To Create Check In' })
        }

        await gamificationModel.create({
            userId,
            activityType:'checkin',
            sourceId:checkInCreate._id,
            expEarned,
            useStateActivity:beforeData,
            levelUp,
            newLevel: levelUp ? getUser.currentLvl : null,
            timestamp: new Date()
        })

        const expToNextLevel = calculateExpToNextLevel(getUser.currentLvl)

        getUser.maxExp = expToNextLevel
        await getUser.save()

        return res.status(201).json({
            success:true,
            message:'Check In Successfully',
            createCheckIn:{
                id:checkInCreate._id,
                moodScore,
                energyScore,
                timestamp:checkInCreate.timestamp,
                firstCheckIn,
                causes,
                emotion
            },
            gamification:{
                expEarned,
                previousExp:beforeData.totalExp,
                currentExp:getUser.currentExp,
                currentLvl:getUser.currentLvl,
                expToNextLevel,
                levelUp,
                checkInStreak:{
                    current:getUser.streaks.current,
                    longest:getUser.streaks.longest,
                    increased:streakInfo.increased,
                    broken:streakInfo.broken,
                    streakUpdated:firstCheckIn
                }
            }
        })

    } catch(error){
        console.error(error)
        return res.status(500).json({ success:false, message:'Some Error Occurred', error })
    }
}

const getCheckInHistory = async (req,res) =>{
    try {
        const userId = req.user.userId

        const limit = parseInt(req.query.limit) || 10
        const skip = parseInt(req.query.skip) ||0

        const checkIn = await checkinModel.find({userId}).sort({timestamp:-1}).limit(limit).skip(skip)

        if(!checkIn){
            return res.status(404).json({
                success:false,
                message:"No Check Ins Found"
            })
        }

        const totalCheckIns = await checkinModel.countDocuments({userId})

        return res.status(200).json({
            success:true,
            checkIn,
            pagination:{
                totalCheckIns
            }
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

const getTodayCheckIns = async(req,res) =>{
    try {
        const userId = req.user.userId

        const latestCheckIns = await checkinModel.findOne({userId}).sort({timestamp:-1})

        const date = new Date()

        const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

        const countCheckIn = await checkinModel.countDocuments({
        userId,
      timestamp: { $gte: start, $lte: end },
        })

        if(!latestCheckIns) {
            return res.status(201).json({
                success:true,
                hasCheckIn:false,
                countCheckIn,
                checkIn:latestCheckIns
            })
        }

        return res.status(200).json({
            success:true,
            hasCheckIn:true,
            checkIn:latestCheckIns,
            countCheckIn,
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

module.exports = {createCheckIn,getCheckInHistory,getTodayCheckIns}
