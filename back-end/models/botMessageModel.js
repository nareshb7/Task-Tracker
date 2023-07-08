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
    }
},{ timestamps: true})

module.exports.BotModel = mongoose.model('botRequest', botSchema)