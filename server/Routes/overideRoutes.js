const express = require('express')
const { getDailyReward } = require('../Controller/dailyrewardController')
const controlOveride = require('../Controller/overiderController')
const verifyToken = require('../Middleware/user')
const router = express.Router()

 
router.post('/anger-mode',verifyToken, controlOveride )

module.exports = router