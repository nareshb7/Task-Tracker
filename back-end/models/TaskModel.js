const mongoose = require('mongoose')

const deletedUsers = mongoose.Schema({
    user: {
        type:Object,
        require: true
    }
})
const mailChangeReq = mongoose.Schema({
    id: {
        type:String,
        require:true
    },
    updateKey: {
        type:String,
        require:true
    },
    updateValue: {
        type:String,
        require:true
    }
})

module.exports.deletedUsers = mongoose.model('deletedUserId', deletedUsers)
module.exports.mailChangeReq = mongoose.model('mailChangeReqUser', mailChangeReq)