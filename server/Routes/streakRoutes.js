const express = require('express')
const { verify } = require('jsonwebtoken')
const { streakController } = require('../Controller/streak-controller')
const router = express.Router()

router.get('/getStreakStatus',verify,streakController)

module.exports = router

