const { default: Expo } = require('expo-server-sdk')


const expo = new Expo()
const sendNotification = async (req,res)=>{
    try {
        const {token,title,body,metadata} = req.body
        if(!Expo.isExpoPushToken(token)){
            res.status(400).json({
                success:false,
                message:'Invalid Token'
            })
        }

        const message = {
            success:true,
            to:token,
            sound:'default',
            title:title,
            body:body,
            data:metadata || {},
        }

        const tickets = await expo.sendPushNotificationsAsync([message])

        return res.status(200).json(tickets)
    } catch (error) {
        console.error('error')
        throw new error
    }
}

module.exports = sendNotification