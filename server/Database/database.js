const mongoose = require('mongoose')
require('dotenv').config()

const connectToDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('Database Connected Successfully!')
    } catch (error) {
        console.error('some error occured', error)
    }

}

module.exports = connectToDB