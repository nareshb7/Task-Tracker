const mongoose = require('mongoose')

const {MockTicket} = require('../models/TicektModel')
const { collection } = require('../models/MessageModel')


module.exports.todayTickts = async (req,res)=> {
    try {
        const tkts = await MockTicket.find({})
        res.status(200).json(tkts)
    } catch (e) {
        res.status(400).json(e.message)
    }
}
module.exports.updateTicket = async (req,res)=> {
    console.log('req',req.body)
    const {selectedTicket, selectedDev, from , obj, id} = req.body
    let tkt = await MockTicket.findById({_id: id})
    if (from== 'ADDISSUE') {
        tkt['status'] = obj.status
        tkt['description'] = obj.description
        tkt['comments'] = obj.comments
        await tkt.save()
        console.log('from', from, obj, id)
        return res.status(200).json(tkt)
    }
    tkt['assignedTo'] = {name: `${selectedDev.fName} ${selectedDev.lName}`, id : selectedDev._id}
    tkt['status'] = 'Assigned'
    tkt['assignedDate'] = new Date()
    await tkt.save()
    res.status(200).json(tkt)
}

// mongoose.connection.db.collection('mocktickets').find({}).toArray(function(err, result) {
//     if (err) throw err;
// });

// const mockTicketss = [
//     {"consultantName": "Jignesh", "phone": "123456789", "technology": "React", "location": "LA", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
//     {"consultantName": 'Nishar', "phone": "123456789", "technology": "Angular", "location": "LA", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
//     {"consultantName": 'Darshini', "phone": "123456789", "technology": "Angular", "location": "LA", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
//     {"consultantName": 'Girish', "phone": "123456789", "technology": "Angular", "location": "NJ", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
//     {"consultantName": 'Ankit', "phone": "123456789", "technology": "Angular", "location": "LA", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
//     {"consultantName": 'Jignesh', "phone": "123456789", "technology": "React", "location": "NJ", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
//     {"consultantName": 'Dolika', "phone": "123456789", "technology": "Vue", "location": "LA", "receivedDate": "Tue, 09 May 2023 02:13:42 GMT","status":""},
// ]