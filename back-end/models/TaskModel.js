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
const ContactUsSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    }

}, {timestamps:true})

module.exports.deletedUsers = mongoose.model('deletedUserId', deletedUsers)
module.exports.mailChangeReq = mongoose.model('mailChangeReqUser', mailChangeReq)
module.exports.contactUsModel = mongoose.model('contactusMessages', ContactUsSchema)