const { default: Expo } = require('expo-server-sdk');
const expo = new Expo();

const sendNotification = async (req,res)=>{
    try {
        const { token, title, body, metadata } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No Token Provided"
            });
        }

        if (!Expo.isExpoPushToken(token)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Expo Push Token'
            });
        }

        const message = {
            to: token,
            sound: 'default',
            title: title || "No Title",
            body: body || "No Body",
            data: metadata || {},
        };

        const tickets = await expo.sendPushNotificationsAsync([message]);
        return res.status(200).json({
            success: true,
            tickets
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = sendNotification;
