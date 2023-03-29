const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5050
const app = express()

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

const routes = require('./routers/TaskRouters')
app.use('/api', routes)
app.use('/users', express.static('./users'))
app.use('/uploads', express.static('./uploads'))

app.listen(port, () => {
    console.log(`server is running on ${port}`)
    app.use('/server', (req, res) => {
        res.send({
            message:'server is running....',
            statusCode:200
        })
    })
})