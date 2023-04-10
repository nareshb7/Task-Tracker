
// const Messages = require('../models/MessageModel')

// const {Server} = require('socket.io')
// const server= require('../server')

// module.exports.messages = async (req,res)=> {
//     const io = new Server(server, {
//         cors: {
//             origin: 'http://localhost:3030',
//             methods: ['GET', 'POST']
//         }
//     } )
//     io.on('connection', (socket)=> {
//         console.log(`USer Connected: ${socket.id}`)
//         socket.on('send_message', (data)=> {
//             console.log('send Message : ', data)
//         })
//     })
// }