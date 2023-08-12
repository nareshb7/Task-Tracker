const mongoose= require('mongoose')

const uploadSchema = new mongoose.Schema({
    fileName: {
        type: String,
        requried: true
    },
    data: {
        type: Buffer,
        require: true
    }
}, {timestamps:true})

module.exports = FilesModel = new mongoose.model('files', uploadSchema)
