const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'journal-folder',
        allowed_format:['jpg','png','jpeg','webp'],
        transformation:[
            {width:1080,crop:'limit'},
            {quality:'auto'},
        ]
    }
})

const upload = multer({storage})

module.exports = upload