const cron = require('node-cron');
const User = require('../Models/user-model');
const { sendPushNotification } = require('../Service/expoNotificationService');
const { isSameDay } = require('../utils/dateHelpers');

const startJournalReminderJob = () => {
    cron.schedule('00 21 * * *', async () => {
        try {
            console.log('Running journal reminder job...');

            const users = await User.find({
                'notification.expopushToken': { $ne: null },
                'notification.reminderSettings': true
            });

            const today = new Date();

            for (const user of users) {
                const hasJournaledToday = isSameDay(user.lastJournal, today);

                if (!hasJournaledToday) {
                    await sendPushNotification({
                        token: user.notification.expopushToken,
                        title: 'Journal Reminder',
                        body: 'Take a few minutes to write your journal for today.',
                        metadata: {
                            type: 'journal_reminder',
                            userId: user._id
                        }
                    });
                }
            }

        } catch (error) {
            console.error('Journal reminder job error:', error);
        }
    });
};

module.exports = {
    startJournalReminderJob
};