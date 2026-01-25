const express = require('express')
const { createCheckIn, getCheckInHistory, getTodayCheckIns,getCheckInById } = require('../Controller/checkinController')
const verifyToken = require('../Middleware/user')
const router = express.Router()

router.post('/createCheckIn',verifyToken,createCheckIn)
router.get('/getCheckInHistory',verifyToken,getCheckInHistory)
router.get('/getCheckInToday',verifyToken,getTodayCheckIns)
router.get('/getCheckIn/:id',verifyToken,getCheckInById)

module.exports = router