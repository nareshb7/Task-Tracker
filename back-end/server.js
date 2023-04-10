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

app.use(cors())
app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ limit: '3mb', extended: false }))

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.use('/db', (req, res) => {
            res.send({
                message:'DB Connected',
                statusCode:200
            })
        })
        console.log(`MongoDB is connected`)
    })
    .catch(err => {
        app.use('/db', (req, res) => {
            res.send({
                message:'DB Error',
                statusCode:400
            })
        })
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
    socket.on('join-room',(room )=> {
        console.log('room', room)
        socket.join(room)
    })
    socket.on('message-room', async (room, content,sender, time, date)=> {
        console.log('message-room', room, content,sender, time, date)
        const newMessage =await Message.create({to: room, content,from : sender, time, date})
        let roomMessages = await getLastMessagesFromRoom(room)
        roomMessages = sortRoomMessagesByDate(roomMessages)
        io.to(room).emit('room-messages', roomMessages)
        socket.broadcast.emit('notifications', room)
    })
    socket.on('check', (data)=> {
        console.log(data, 'checkddddd')
    })
})

server.listen(port, () => {
    console.log(`server is running on ${port}`)
    app.use('/server', (req, res) => {
        res.send({
            message:'server is running....',
            statusCode:200
        })
    })
})
module.exports.server = app