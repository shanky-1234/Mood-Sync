const cron = require('node-cron');
const User = require('../Models/user-model');
const { isSameDay } = require('../utils/dateHelpers');
const { createAndSendNotification } = require('../Service/notificationService');

let checkInReminderTask = null;

const startCheckInReminderJob = () => {
  if (checkInReminderTask) {
    console.log('Check-in reminder job already running. Skipping duplicate start.');
    return;
  }

  const cronExpression = process.env.CHECKIN_REMINDER_CRON || '*/1 * * * *';
  const timezone = process.env.CHECKIN_REMINDER_TIMEZONE || 'Asia/Kathmandu';

  console.log(`Starting check-in reminder cron job: ${cronExpression} (${timezone})`);

  checkInReminderTask = cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log('Running check-in reminder job...');

        const users = await User.find({
          'notification.expopushToken': { $exists: true, $nin: [null, ''] },
          
        });

        const today = new Date();

        for (const user of users) {
          const hasCheckedInToday = user.lastCheckIn
            ? isSameDay(user.lastCheckIn, today)
            : false;

          const hasSentReminderToday = user.lastCheckInReminderSent
            ? isSameDay(user.lastCheckInReminderSent, today)
            : false;

          if (!hasCheckedInToday && !hasSentReminderToday) {
            await createAndSendNotification({
              user,
              title: 'Check-In Reminder',
              body: 'Take a moment to complete your daily check-in.',
              type: 'checkin_reminder',
              metadata: {
                type: 'checkin_reminder',
                userId: user._id,
              },
            });

            user.lastCheckInReminderSent = today;
            await user.save();
          }
        }
      } catch (error) {
        console.error('Check-in reminder job error:', error);
      }
    },
    { timezone }
  );
};

module.exports = {
  startCheckInReminderJob,
};