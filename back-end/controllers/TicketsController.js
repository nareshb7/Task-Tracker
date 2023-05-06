const Ticket = require('../models/TicektModel')

const mockTickets = [
    {name: 'Devarsh', phn: '123456789', technology: 'React', location: 'LA', receivedDate: new Date()},
    {name: 'Saeed', phn: '123456789', technology: 'React', location: 'NJ', receivedDate: new Date()},
    {name: 'Aarti', phn: '123456789', technology: 'React', location: 'CA', receivedDate: new Date()},
    {name: 'Jignesh', phn: '123456789', technology: 'React', location: 'LA', receivedDate: new Date()},
    {name: 'Nishar', phn: '123456789', technology: 'Angular', location: 'LA', receivedDate: new Date()},
    {name: 'Darshini', phn: '123456789', technology: 'Angular', location: 'LA', receivedDate: new Date()},
    {name: 'Girish', phn: '123456789', technology: 'Angular', location: 'NJ', receivedDate: new Date()},
    {name: 'Ankit', phn: '123456789', technology: 'Angular', location: 'LA', receivedDate: new Date()},
    {name: 'Jignesh', phn: '123456789', technology: 'React', location: 'NJ', receivedDate: new Date()},
    {name: 'Dolika', phn: '123456789', technology: 'Vue', location: 'LA', receivedDate: new Date()},
]

module.exports.todayTickts = async (req,res)=> {
    res.status(200).json(mockTickets)
}