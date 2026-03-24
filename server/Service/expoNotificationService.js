const { Expo } = require('expo-server-sdk')

const expo = new Expo();

const sendPushNotification = async ({ token, title, body, metadata = {} }) => {
    if (!token) {
        throw new Error('No token provided');
    }

    if (!Expo.isExpoPushToken(token)) {
        throw new Error('Invalid Expo push token');
    }

    const messages = [
        {
            to: token,
            sound: 'default',
            title: title || 'Notification',
            body: body || '',
            data: metadata,
        }
    ];

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
    }

    return tickets;
};

module.exports = {
    sendPushNotification
};