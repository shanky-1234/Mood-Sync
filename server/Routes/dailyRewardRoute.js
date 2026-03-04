const express = require('express')
const { getDailyReward } = require('../Controller/dailyrewardController')
const router = express.Router()
const verifyToken = require('../Middleware/user')

router.get('/getTodayReward',verifyToken,getDailyReward)

module.exports = router