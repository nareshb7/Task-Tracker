const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const http = require('http')
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5050
const app = express()
const {Server} = require('socket.io')

const server = http.createServer(app)
const routes = require('./routers/TaskRouters')
const Message = require('./models/MessageModel')
const { signUpModel } = require('./models/UsersModel')

app.use(cors())
app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ limit: '3mb', extended: false }))

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log(`MongoDB is connected`)
    })
    .catch(err => {
        console.log(`Error ${err}`)
    })



app.use('/api', routes)
app.use('/users', express.static('./users'))
app.use('/uploads', express.static('./uploads'))

const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

const getLastMessagesFromRoom =async (room)=> {
    let roomMessages =await Message.aggregate([
        {$match : {to: room}},
        {$group: {_id: '$date', messageByDate: {$push : '$$ROOT'}}}
    ])
    return roomMessages
}
const sortRoomMessagesByDate =(messages)=> {
    return messages.sort((a, b)=> {
        let date1 = a._id.split('/')
        let date2 = b._id.split('/')
        date1 = date1[2]+ date1[0]+ date1[1] 
        date2 = date2[2]+ date2[0]+ date2[1] 
        return date1 < date2 ? -1 : 1
    })
}
io.on('connection',async (socket)=> {
    console.log('connected', socket.id)

    socket.on('new-user', async()=> {
        const members = await signUpModel.find()
        io.emit('new-user', members)
    })
    socket.on('join-room',async (room, previousRoom)=> {
        socket.join(room)
        socket.leave(previousRoom)
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        socket.emit('room-messages', roomMessages, room)
    })
    socket.on('message-room', async (room, content, sender, time, date, opponentId )=> {
        const newMessage =await Message.create({to: room, content,from : sender, time, date})
        const userData = await signUpModel.findById({_id: opponentId})
        userData.newMessages[room] = (userData.newMessages[room] || 0 ) + 1
        await userData.markModified('newMessages');
        await userData.save()
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        io.to(room).emit('room-messages', roomMessages)
        console.log('Message: ',room, sender.fName,content )
        socket.broadcast.emit('notifications', room, opponentId, sender)
    })
    socket.on('AssignTicket', (val, id, sender)=> {
        socket.broadcast.emit('ticketAssigned', val, id, sender)
    })
})

server.listen(port, () => {
    console.log(`server is running on ${port}`)
})
module.exports = {getLastMessagesFromRoom,sortRoomMessagesByDate }
module.exports.server = app