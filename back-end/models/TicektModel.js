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
    },
    location: {
        type: String,
        require: true
    },
    receivedDate: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    phone: {
        type:String,
        require: true
    }
})
const mockTicketSchema = mongoose.Schema({
    consultantName: {
        type:String,
        require: true
    },
    phone: {
        type:String,
        require:true
    },
    technology: {
        type:String,
        require: true
    },
    location: {
        type:String,
        require: true
    },
    receivedDate: {
        type: Date,
        require: true,
        default: new Date()
    },
    status: {
        type:String,
        require:true
    },
    assignedTo: {
        type:Object,
        require:true
    },
    assignedDate: {
        type: Date,
        require: true
    },
    targetDate: {
        type: Date,
        require: true,
        default: new Date()
    },
    completedDate: {
        type:Date,
        require: true
    },
    helpedDev: {
        type:Object,
        require: true
    }
})

module.exports.Ticket = mongoose.model('ticket', ticketSchema)
module.exports.MockTicket = mongoose.model('mockticket', mockTicketSchema)