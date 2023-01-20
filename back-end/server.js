const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

const port = process.env.PORT || 5050
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log(`MongoDB is connected`))
.catch(err => console.log(`Error ${err}`))

const routes = require('./routers/TaskRouters')
app.use('/',routes)


app.listen(port, ()=> console.log(`server is running on ${port}`))