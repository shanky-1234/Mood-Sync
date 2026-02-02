const gamificationModel = require('../Models/gamification-model')
const journalModel = require('../Models/journal-model')
const Journal =  require('../Models/journal-model')
const userModel = require('../Models/user-model')
const User = require('../Models/user-model')
const { journalAnalysis } = require('../Service/journalAnalysis')
const { calculateJournalExp, updateLevel, calculateExpToNextLevel, updateStreaks } = require('../utils/calculation')




const getAllJournal = async (req,res)=>{
    try {
        const journals = await Journal.find({userId:req.user.userId}).sort({createdAt:-1}).populate('userId','fullname gender email age')
        if(!journals){
            return res.status(404).json({
            success:false,
            message:'Journal is Empty'
        })
        }

        const total = journals.length
    await User.findByIdAndUpdate(
      req.user.userId,
      { totalJournals: total }
    );
        return res.status(200).json({
            success:true,
            message:'Journaling All',
            totalJournal:journals.length,
            journals
        })
    } catch (error) {
        console.error('error')
        return res.status(500).json({
            success:false,
            message:'Some Error Occured'
        })
    }
}

const getJournalById = async(req,res) =>{
    try {
        const journal = await Journal.findOne({_id:req.params.id,userId:req.user.userId}).populate('userId','fullname gender email age')
        if(!journal){
            return res.status(404).json({
            success:false,
            message:'NO Journal Found'
            })
        }
        return res.status(200).json({
            success:true,
            message:'Journal Found',
            journal
        })
    } catch (error) {
          console.error('error')
        return res.status(500).json({
            success:false,
            message:'Some Error Occured'
        })
    }
} 

const createJournal = async (req, res) => {
    try {
        const { title,color,content} = req.body;

        if (!title || !title.trim()) {
            return res.status(403).json({
                success: false,
                message: 'Fields Are Empty'
            });
        }

        const newJournal = await Journal.create({
            userId: req.user.userId,
            title,
            content,
            color: color || '#EB2D2E',
            status:'draft'
        });

        await newJournal.populate('userId','fullname gender email age')

        
        return res.status(200).json({
            success: true,
            message: 'New Journal Entry',
            newJournal,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Some Error Occurred'
        });
    }
};

const updateJournal = async (req, res) => {
  try {
    const { title, content, color } = req.body;

    const updatedJournal = await Journal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        status: { $ne: "analysisCompleted" } 
      },
      [
        {
          $set: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
            ...(color !== undefined && { color }),

            status: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$status", "draft"] },
                    { $gt: [{ $strLenCP: content || "" }, 0] }
                  ]
                },
                then: "inProgress",
                else: "$status"
              }
            }
          }
        }
      ],
      {
        new: true,
        runValidators: true
      }
    ).populate("userId", "fullname gender email age");

    if (!updatedJournal) {
      return res.status(403).json({
        success: false,
        message: "Journal not found or locked"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal Updated Successfully!",
      newJournal: updatedJournal
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occurred"
    });
  }
};


const deleteJournal = async (req,res)=>{
    try {
        const id = req.params.id
        if(!id){
            return res.status(404).json({
                success:false,
                message:"No id is provided"
            })
        }
        const deleteJournal = await Journal.findOneAndDelete({
            _id:id,userId:req.user.userId
        }).populate('userId','fullname gender email age')

        if(!deleteJournal){
            return res.status(404).json({
                success:false,
                message:'Jounral Not Found'
            })
        }

        return res.status(200).json({
            success:true,
            message:'Jounral Successfully Deleted',
            deleteJournal
        })
    } catch (error) {
          console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Some Error Occurred'
        });
    }
}

const getTodayJournal = async(req,res) =>{
    try {
        const userId = req.user.userId

      

        const date = new Date()

        const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

        const countJournal = await journalModel.countDocuments({
        userId,
      createdAt: { $gte: start, $lte: end },
        })

          const latestJournal = await journalModel.findOne({
      userId,
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });


        if(!countJournal) {
            return res.status(201).json({
                success:true,
                hasJournal:false,
                countJournal,
                journal:latestJournal
            })
        }

        return res.status(200).json({
            success:true,
            hasJournal:true,
            journal:latestJournal,
            countJournal,
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

const analyzeJournal = async (req,res)=>{
    try{
    const id= req.params.id

    const user = await userModel.findById(req.user.userId)

    if(!id) {
        return res.status(404).json({
            success:false,
            message:"Journal Not Found"
        })
    }

    let getJournal = await journalModel.findOne({_id:id,userId:req.user.userId})
    
    if(!getJournal){
        return res.status(404).json({
    success: false,
    message: "Journal Not Found"
  });
    }


    if (getJournal.status === 'analyzing'){
        return res.status(403).json({
            success:false,
            message:'Analysis on Process'
        })
    }
    if (!getJournal.content || getJournal.content.trim() === '') {
        return res.status(403).json({
            success:false,
            message:'No Content To analyze'
        })
    }
    if (getJournal.status === 'analysisCompleted'){
        return res.status(403).json({
            success:false,
            message:'Analysis Done! Cannot Analyze'
        })
    }

    getJournal.status = 'analyzing'
    await getJournal.save()

    const journalCountDays =await journalModel.countDocuments({
        userId:req.user.userId,
        status:'analysisCompleted',
        updatedAt: { $gte: Date.now() }
    })

    const firstJournalToday =journalCountDays ===0
    const analysis = await journalAnalysis(getJournal.content)
    if(!analysis){
        getJournal.status ='inProgress'
        await getJournal.save()
    }
    getJournal.analysis = analysis
    getJournal.status = 'analysisCompleted'
    await getJournal.save()

    const today = new Date()
        const todayDate = new Date(today)
        todayDate.setHours(0,0,0,0)

    const lastDate = user.streaks.lastDate 
    lastDate ? new Date(user.streaks.lastDate).setHours(0,0,0,0):null

     let streakInfo = {increased:false,broken:false}
    const streakAlreadyUpdated = lastDate === today.getTime()

    if (!streakAlreadyUpdated) {
  streakInfo = updateStreaks(user)
}

    const expEarned = calculateJournalExp(getJournal,user.streaks.current)

    const beforeData={
        level: user.currentLvl,
  totalExp: user.currentExp,
  totalStreak: user.streaks.current,
    }

    user.currentExp +=expEarned

    const levelUp = updateLevel(user)

    user.totalJournals += 1
    user.lastMoodScore = getJournal.analysis.scores.moodScore;
    user.lastEnergyScore = getJournal.analysis.scores.energyScore
    user.lastJournal = today
    user.lastSolution = getJournal.analysis.solution

    await user.save()

    await gamificationModel.create({
  userId: user._id,
  activityType: 'journal',
  sourceId: getJournal._id,
  expEarned,
  useStateActivity: beforeData,
  levelUp,
  newLevel: levelUp ? user.currentLvl : null,
  timestamp: new Date()
})

    user.maxExp = calculateExpToNextLevel(user.currentLvl)
    await user.save()


    return res.status(201).json({
        success:true,
        message:'Journal Analysis Completed',
        getJournal,
        gamification: {
    expEarned,
    previousExp: beforeData.totalExp,
    currentExp: user.currentExp,
    currentLvl: user.currentLvl,
    expToNextLevel: user.maxExp,
    levelUp,
    journalStreak: {
      current: user.streaks.current,
      longest: user.streaks.longest,
      increased: streakInfo.increased,
      broken: streakInfo.broken,
      streakUpdated: firstJournalToday
    }
}
    })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:'Error'
        })    }
}


module.exports = {getAllJournal, getJournalById, createJournal, updateJournal,deleteJournal,getTodayJournal,analyzeJournal}