const express = require('express');
const router = express.Router();

const {
    registerPushToken,
    updateReminderSettings,
    sendTestPush,
    getNotification
} = require('../Controller/notiController');

const authMiddleware = require('../Middleware/user');

router.post('/register-token', authMiddleware, registerPushToken);
router.put('/reminder-settings', authMiddleware, updateReminderSettings);
router.post('/test-push',authMiddleware,sendTestPush)
router.get('/get-notifications', authMiddleware, getNotification);

module.exports = router;