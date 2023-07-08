const mongoose = require('mongoose')

const botSchema = mongoose.Schema({
    user: {
        type: Object,
        require: true
    },
    type: {
        type:String,
        require: true
    },
    description: {
        type: String,
        require: true
    }, 
    team : {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'Pending'
    }
},{ timestamps: true})

module.exports.BotModel = mongoose.model('botRequest', botSchema)