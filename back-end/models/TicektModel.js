const mongoose = require('mongoose')


const ticketSchema = mongoose.Schema({
    consultantName: {
        type:String,
        require: true
    },
    location: {
        type:String,
        require: true
    },
    receivedDate: {
        type: Date,
        require: true
    },
    targetDate: {
        type: Date,
        require: true
    },
    technology: {
        type: String,
        require: true
    }
})

module.exports.Ticket = mongoose.model('ticket', ticketSchema)