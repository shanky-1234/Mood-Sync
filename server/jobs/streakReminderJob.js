const cron = require('node-cron');
const User = require('../Models/user-model');
const { sendPushNotification } = require('../Service/expoNotificationService');
const { isSameDay } = require('../utils/dateHelpers');

const startStreakReminderJob = () => {
    cron.schedule('30 20 * * *', async () => {
        try {
            console.log('Running streak reminder job...');

            const users = await User.find({
                'notification.expopushToken': { $ne: null },
                'notification.reminderSettings.streakReminderEnabled': true
            });

            const today = new Date();

            for (const user of users) {
                const hasCheckedInToday = isSameDay(user.lastCheckIn, today);

                if (!hasCheckedInToday) {
                    await sendPushNotification({
                        token: user.notification.expopushToken,
                        title: "Don't lose your streak",
                        body: "You haven’t checked in today. Open the app and keep your streak alive.",
                        metadata: {
                            type: 'streak_reminder',
                            userId: user._id
                        }
                    });
                }
            }

        } catch (error) {
            console.error('Streak reminder job error:', error);
        }
    });
};

module.exports = {
    startStreakReminderJob
};