const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5050
const app = express()



// app.use(
//     fileUpload({
//         limits: {
//             fileSize: 10000000,
//         },
//         abortOnLimit: true,
//     })
// );

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))



mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log(`MongoDB is connected`))
.catch(err => console.log(`Error ${err}`))

const routes = require('./routers/TaskRouters')
app.use('/',routes)
app.use('/users', express.static('./users'))
app.use('/uploads',express.static('./uploads'))

app.listen(port, ()=> console.log(`server is running on ${port}`))