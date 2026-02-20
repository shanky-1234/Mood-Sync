const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

const sendMail = async({to,subject,html})=>{
    try{
        await transporter.sendMail({
            from:`"MoodSync" <${process.env.EMAIL}>`,
            to,
            subject,
            html
        })
        console.log('EMAIL SENT TO',to)
    }
    catch(error){
        console.error(error)
        throw error
    }
}

module.exports = sendMail


