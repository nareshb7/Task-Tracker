const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: String,
    from :Object,
    to:String,
    time:String,
    date:String,
    time:String,
    type:String,
    fileID: String
}, {minimize: false})
const Message = mongoose.model('Message', messageSchema)
module.exports = Message