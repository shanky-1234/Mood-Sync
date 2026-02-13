const express = require('express')
const verifyToken = require('../Middleware/user')
const { createJournal, getAllJournal, updateJournal, deleteJournal,getJournalById,getTodayJournal, analyzeJournal, uploadPhotos, deletePhoto} = require('../Controller/journalController')
const upload = require('../Middleware/upload')
const router = express.Router()

router.post('/createJournal',verifyToken,createJournal)
router.get('/getJournalById/:id',verifyToken,getJournalById)
router.get('/getAllJournal',verifyToken,getAllJournal)
router.get('/getTodayJournal',verifyToken,getTodayJournal)
router.put('/updateJournal/:id',verifyToken,updateJournal)
router.delete('/deleteJournal/:id',verifyToken,deleteJournal)
router.post('/analyseJournal/:id',verifyToken,analyzeJournal)
router.put('/:id/photos',verifyToken,upload.array('photos'),uploadPhotos)
router.delete('/:id/photos/:photoId',verifyToken,deletePhoto)


module.exports = router