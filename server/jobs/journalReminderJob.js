const cron = require('node-cron');
const User = require('../Models/user-model');
const { isSameDay } = require('../utils/dateHelpers');
const { createAndSendNotification } = require('../Service/notificationService');

let journalReminderTask = null;

const startJournalReminderJob = () => {
  if (journalReminderTask) {
    console.log('Journal reminder job already running. Skipping duplicate start.');
    return;
  }

  const cronExpression = process.env.JOURNAL_REMINDER_CRON || '*/1 * * * *';
  const timezone = process.env.JOURNAL_REMINDER_TIMEZONE || 'Asia/Kathmandu';

  console.log(`Starting journal reminder cron job: ${cronExpression} (${timezone})`);

  journalReminderTask = cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log('Running journal reminder job...');

        const users = await User.find({
          'notification.expopushToken': { $exists: true, $nin: [null, ''] },
         
        });

        const today = new Date();

        for (const user of users) {
          const hasJournaledToday = user.lastJournal
            ? isSameDay(user.lastJournal, today)
            : false;

          const hasSentReminderToday = user.lastJournalReminderSent
            ? isSameDay(user.lastJournalReminderSent, today)
            : false;

          if (!hasJournaledToday && !hasSentReminderToday) {
            await createAndSendNotification({
              user,
              title: 'Journal Reminder',
              body: 'Take a few minutes to write your journal for today.',
              type: 'journal_reminder',
              metadata: {
                type: 'journal_reminder',
                userId: user._id,
              },
            });

            user.lastJournalReminderSent = today;
            await user.save()
          }
        }
      } catch (error) {
        console.error('Journal reminder job error:', error);
      }
    },
    { timezone }
  );
};

module.exports = {
  startJournalReminderJob,
};