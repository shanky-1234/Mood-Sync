const express = require('express')
const verifyToken = require('../Middleware/user')
const { createJournal, getAllJournal, updateJournal, deleteJournal,getJournalById,getTodayJournal} = require('../Controller/journalController')
const router = express.Router()

router.post('/createJournal',verifyToken,createJournal)
router.get('/getJournalById/:id',verifyToken,getJournalById)
router.get('/getAllJournal',verifyToken,getAllJournal)
router.get('/getTodayJournal',verifyToken,getTodayJournal)
router.put('/updateJournal/:id',verifyToken,updateJournal)
router.delete('/deleteJournal/:id',verifyToken,deleteJournal)

module.exports = router