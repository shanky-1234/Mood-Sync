const express = require('express')
const { registerUser, login } = require('../Controller/authController')

const router = express.Router()

router.post('/registerUser',registerUser)
router.post('/login',login)

module.exports = router