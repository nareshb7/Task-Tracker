const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    from: {
        type:String,
        require:true
    },
    to: {
        type:String,
        require: true
    },
    messages: {
        type:Array,
        require: true
    }
})
module.exports.Messages = mongoose.model('Messages', messageSchema)