const mongoose = require('mongoose')


const ticketSchema = mongoose.Schema({
    consultantName: {
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
    consultantId: {
        type: String,
        require: true
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
        default: new Date('05/14/2023')
    },
    completedDate: {
        type:Date,
        require: true
    },
    helpedDev: {
        type:Object,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    comments: {
        type: String,
        require: true
    },
    assignedBy: {
        type: Object, 
        require: true
    }
})
const clientSchema = mongoose.Schema({
    consultantName: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true,
        unique:true,
        dropDups:true
    },
    companyName: {
        type: String,
        require: true
    },
    appType: {
        type: String,
        require: true
    },
    technology: {
        type:String,
        require: true,
        default: 'React'
    },
    email: {
        type:String,
        require: true
    }
}, {timestamps: true})

module.exports.Ticket = mongoose.model('ticket', ticketSchema)
module.exports.MockTicket = mongoose.model('mockticket', mockTicketSchema)
module.exports.clientModel = mongoose.model('Client', clientSchema)