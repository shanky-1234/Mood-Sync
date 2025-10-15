const express = require('express')
<<<<<<< HEAD
const { registerUser, login,logout } = require('../Controller/authController')
=======
const { registerUser, login } = require('../Controller/authController')
>>>>>>> origin/main

const router = express.Router()

router.post('/registerUser',registerUser)
router.post('/login',login)
<<<<<<< HEAD
router.post('/logout',logout)
=======
>>>>>>> origin/main

module.exports = router