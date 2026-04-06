const cron = require('node-cron');
const User = require('../Models/user-model');
const { isSameDay } = require('../utils/dateHelpers');
const { createAndSendNotification } = require('../Service/notificationService');

let streakReminderTask = null;

const startStreakReminderJob = () => {
  if (streakReminderTask) {
    console.log('Streak reminder job already running. Skipping duplicate start.');
    return;
  }

  const cronExpression = process.env.STREAK_REMINDER_CRON || '*/2 * * * *';
  const timezone = process.env.STREAK_REMINDER_TIMEZONE || 'Asia/Kathmandu';

  console.log(`Starting streak reminder cron job: ${cronExpression} (${timezone})`);

  streakReminderTask = cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log('Running streak reminder job...');

        const users = await User.find({
          'notification.expopushToken': { $exists: true, $nin: [null, ''] },
          'notification.reminderSetting.streakReminder': true
        });

        console.log('Matched users:', users.length);

        const today = new Date();

        for (const user of users) {
          const hasCheckedInToday = user.lastCheckIn
            ? isSameDay(user.lastCheckIn, today)
            : false;

          const hasSentReminderToday = user.lastStreakReminderSent
            ? isSameDay(user.lastStreakReminderSent, today)
            : false;

          if (!hasCheckedInToday && !hasSentReminderToday) {
            try {
              await createAndSendNotification({
                user,
                title: "Don't lose your streak",
                body: "You haven't checked in today.",
                type: 'streak_reminder',
                metadata: {
                  type: 'streak_reminder',
                  userId: user._id,
                },
              });

              user.lastStreakReminderSent = today;
              await user.save();

              console.log(`Stored and sent streak reminder to user ${user._id}`);
            } catch (error) {
              console.error(`Failed for user ${user._id}:`, error.message);
            }
          } else {
            console.log(`Skipping user ${user._id} because already checked in today or reminder already sent`);
          }
        }
      } catch (error) {
        console.error('Streak reminder job error:', error);
      }
    },
    {
      timezone,
    }
  );
};

const stopStreakReminderJob = () => {
  if (streakReminderTask) {
    streakReminderTask.stop();
    streakReminderTask = null;
    console.log('Streak reminder job stopped.');
  }
};

module.exports = {
  startStreakReminderJob,
  stopStreakReminderJob,
};