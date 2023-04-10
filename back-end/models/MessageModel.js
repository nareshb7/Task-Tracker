const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: String,
    from :Object,
    to:String,
    time:String,
    date:String,
    time:String
})
const Message = mongoose.model('Message', messageSchema)
module.exports = Message