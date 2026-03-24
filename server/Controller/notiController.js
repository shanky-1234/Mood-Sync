const User = require('../Models/user-model');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

const registerPushToken = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user.userId;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'No token provided'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'notification.expopushToken': token
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Push token saved successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('registerPushToken error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const updateReminderSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            checkInEnabled,
            journalEnabled,
            streakReminderEnabled,
            checkInHour,
            checkInMinute,
            journalHour,
            journalMinute
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'notifications.reminderSettings.checkInEnabled': checkInEnabled,
                    'notifications.reminderSettings.journalEnabled': journalEnabled,
                    'notifications.reminderSettings.streakReminderEnabled': streakReminderEnabled,
                    'notifications.reminderTimes.checkInHour': checkInHour,
                    'notifications.reminderTimes.checkInMinute': checkInMinute,
                    'notifications.reminderTimes.journalHour': journalHour,
                    'notifications.reminderTimes.journalMinute': journalMinute,
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Reminder settings updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('updateReminderSettings error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const sendTestPush = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user || !user.notification?.expopushToken) {
            return res.status(400).json({
                success: false,
                message: 'No saved Expo push token found for this user'
            });
        }

        const token = user.notification.expopushToken;

        if (!Expo.isExpoPushToken(token)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Expo push token'
            });
        }

        const message = {
            to: token,
            sound: 'default',
            title: 'Test Push',
            body: 'If you see this, push notification is working.',
            data: {
                type: 'test_push'
            }
        };

        const tickets = await expo.sendPushNotificationsAsync([message]);

        return res.status(200).json({
            success: true,
            message: 'Test push sent',
            tickets
        });

    } catch (error) {
        console.error('sendTestPush error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = {
    registerPushToken,
    updateReminderSettings,
    sendTestPush
};