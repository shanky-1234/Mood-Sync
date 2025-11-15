const express = require('express')
const sendNotification = require('../Controller/notiController')
const verifyToken = require('../Middleware/user')

const router = express.Router()

router.post('/sendNotification',verifyToken,sendNotification)

module.exports = router