const Ticket = require('../models/TicektModel')

const mockTickets = [
    {_id: 1,name: 'Devarsh', phn: '123456789', technology: 'React', location: 'LA', receivedDate: new Date(), status:''},
    {_id: 2, name: 'Saeed', phn: '123456789', technology: 'React', location: 'NJ', receivedDate: new Date(), status:''},
    {_id: 3, name: 'Aarti', phn: '123456789', technology: 'React', location: 'CA', receivedDate: new Date(), status:''},
    {_id: 4, name: 'Jignesh', phn: '123456789', technology: 'React', location: 'LA', receivedDate: new Date(), status:''},
    {_id: 5, name: 'Nishar', phn: '123456789', technology: 'Angular', location: 'LA', receivedDate: new Date(), status:''},
    {_id: 6, name: 'Darshini', phn: '123456789', technology: 'Angular', location: 'LA', receivedDate: new Date(), status:''},
    {_id: 7, name: 'Girish', phn: '123456789', technology: 'Angular', location: 'NJ', receivedDate: new Date(), status:''},
    {_id: 8, name: 'Ankit', phn: '123456789', technology: 'Angular', location: 'LA', receivedDate: new Date(), status:''},
    {_id: 9, name: 'Jignesh', phn: '123456789', technology: 'React', location: 'NJ', receivedDate: new Date(), status:''},
    {_id: 10,name: 'Dolika', phn: '123456789', technology: 'Vue', location: 'LA', receivedDate: new Date(), status:''},
]

module.exports.todayTickts = async (req,res)=> {
    res.status(200).json(mockTickets)
}
module.exports.updateTicket = async (req,res)=> {
    res.status(200).json('done')
}