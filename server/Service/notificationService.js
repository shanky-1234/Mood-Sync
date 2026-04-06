const Notification = require('../Models/notification-model');
const { sendPushNotification } = require('./expoNotificationService');

const createAndSendNotification = async ({
  user,
  title,
  body,
  type = 'general',
  metadata = {},
}) => {
  const token = user.notification?.expopushToken?.trim();

  // 1. Save in DB no matter what
  const savedNotification = await Notification.create({
    userId: user._id,
    title,
    body,
    type,
    sentAt: new Date(),
    metadata,
  });

  // 2. Try sending push if token exists
  let pushResult = null;
  let pushError = null;

  if (token) {
    try {
      pushResult = await sendPushNotification({
        token,
        title,
        body,
        metadata,
      });
    } catch (error) {
      pushError = error.message;
      console.error(`Push send failed for user ${user._id}:`, error.message);
    }
  }

  return {
    savedNotification,
    pushResult,
    pushError,
  };
};

module.exports = {
  createAndSendNotification,
};