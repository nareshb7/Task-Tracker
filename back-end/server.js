const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const http = require('http')
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5050
const app = express()
const { Server } = require('socket.io')

const server = http.createServer(app)
const routes = require('./routers/TaskRouters')
const Message = require('./models/MessageModel')
const { EmployeesList } = require('./models/UsersModel')

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
app.use('/error', (req,res)=> {
    res.status(400).json('You are not authenticated')
})
const paths = ['/getparticularuser', '/logout', '/loginData']
const expressMiddleware = (req, res, next) => {
    console.log('URL::', req?.url, req?.method, req?.headers?.authorization)
    if (req?.headers?.authorization || paths.includes(req.url)) {
        next()
    }else {
        res.redirect('/error')
    }
}

app.use('/api', expressMiddleware, routes)
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
let skip = 0
let roomID = ''
const getLastMessagesFromRoom = async (room, isStart=null) => {
    const count = await Message.find({ to: room }).count()
    if (roomID != room || isStart) {
        roomID = room
        totalMszCount = ''
    }
    if (!totalMszCount || totalMszCount != count) {
        totalMszCount = count
        skip = totalMszCount
    }
    if (skip == 0) return []
    skip = skip > limit ? skip - limit : 0
    let roomMessages = await Message.aggregate([
        { $match: { to: room } },
        { $sort: { _id: 1 } },
        { $skip: skip },
        { $limit: limit },
        { $group: { _id: '$date', messageByDate: { $push: '$$ROOT' } } }
    ])
    return roomMessages
}
const sortRoomMessagesByDate = (messages) => {
    return messages.sort((a, b) => {
        let date1 = a._id.split('/')
        let date2 = b._id.split('/')
        date1 = date1[2] + date1[0] + date1[1]
        date2 = date2[2] + date2[0] + date2[1]
        return date1 < date2 ? -1 : 1
    })
}
const getLatestUsers =async (userId, members )=> {
    const memIds = members.map(i => i._id.valueOf())
    const rooms = await Message.find({ 'from.id': userId}, { to: 1, _id: 0 }).sort({ _id: -1 })
        const latestIds = [...new Set(rooms.map(v => v.to))]
            .map(v => v.split(userId).filter(i => i)[0].replace('-', ''))
        const final = [...new Set([...latestIds, ...memIds])]
        const users = []
        final.forEach(val => {
            users.push(members.find(v => v._id == val))
        })
        return users.filter(i=> i)
}
io.on('connection', async (socket) => {
    console.log('connected', socket.id)

    socket.on('new-user', async (id='', opponent) => {
        const members = await EmployeesList.find()
        const users = await getLatestUsers(id, members)
        const opponentUsers = await getLatestUsers(opponent, members)
        io.emit('new-user', users, id, opponentUsers, opponent)
    })
    socket.on('join-room', async (room, previousRoom) => {
        socket.join(room)
        socket.leave(previousRoom)
        let roomMessages = await getLastMessagesFromRoom(room, 'INITIAL')
        roomMessages = sortRoomMessagesByDate(roomMessages)
        socket.emit('room-messages', roomMessages, room)
    })
    socket.on('get-last-mszs', async (room) => {
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        socket.emit('room-messages', roomMessages, room, "LAST-MSZ")
    })
    socket.on('message-room', async (room, content, sender, time, date, opponentId, type, fileLink) => {
        const newMessage = await Message.create({ to: room, content, from: sender, time, date, type, fileLink })
        // await Message.deleteMany({})
        const userData = await EmployeesList.findById({ _id: opponentId })
        userData.newMessages[room] = (userData.newMessages[room] || 0) + 1
        await userData.markModified('newMessages');
        await userData.save()
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        io.to(room).emit('room-messages', roomMessages)
        console.log('Message: ', room, sender.fName, content)
        socket.broadcast.emit('notifications', room, opponentId, sender)
    })
    socket.on('AssignTicket', (val, id, sender) => {
        socket.broadcast.emit('ticketAssigned', val, id, sender)
    })
    socket.on('new-bot-request', (request) => {
        socket.broadcast.emit('new-bot-request-added', request)
    })
})

server.listen(port, () => {
    console.log(`server is running on ${port}`)
})
module.exports = { getLastMessagesFromRoom, sortRoomMessagesByDate }
module.exports.server = app