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
app.set('trust proxy', true);
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

const expressMiddleware = (req,res,next)=> {
    console.log('URL::', req.originalUrl)
    next()
}

app.use('/api',expressMiddleware, routes)
app.use('/users', express.static('./users'))
app.use('/uploads', express.static('./uploads'))

const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

let totalMszCount = ''
const limit = 20
let skip =0
let roomID = ''
const getLastMessagesFromRoom =async (room)=> {
    const count =await Message.find({to: room}).count()
    if (roomID != room) {
        roomID = room
        totalMszCount =''
    }
    if(!totalMszCount || totalMszCount != count) {
        totalMszCount = count
        skip =totalMszCount
    }
    if(skip == 0 ) return []
    skip = skip > limit ? skip - limit: 0
    let roomMessages =await Message.aggregate([
        {$match : {to: room}},
        {$sort: {_id: 1}},
        {$skip: skip},
        {$limit: limit},
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
        const rooms  = await Message.find({}, {to:1, _id: 0}).sort({_id : -1})
        const latestIds = [...new Set(rooms.map(v => v.to))].filter(v => v.includes('63ebcf33b9e7c974480c71f3')).map(v=> v.split('63ebcf33b9e7c974480c71f3'))
        console.log('ROOMS', latestIds)
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
    socket.on('get-last-mszs', async(room)=> {
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        socket.emit('room-messages', roomMessages, room, "LAST-MSZ")
    })
    socket.on('message-room', async (room, content, sender, time, date, opponentId , type, fileLink)=> {
        const newMessage =await Message.create({to: room, content,from : sender, time, date, type, fileLink})
        // await Message.deleteMany({})
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
    socket.on('new-bot-request', (request)=> {
        socket.broadcast.emit('new-bot-request-added', request)
    } )
})

server.listen(port, () => {
    console.log(`server is running on ${port}`)
})
module.exports = {getLastMessagesFromRoom,sortRoomMessagesByDate }
module.exports.server = app