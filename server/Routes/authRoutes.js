const express = require('express')
const { registerUser, login,logout } = require('../Controller/authController')

const router = express.Router()

router.post('/registerUser',registerUser)
router.post('/login',login)
router.post('/logout',logout)

module.exports = router