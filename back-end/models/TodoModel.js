const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    dName: {
        type: String,
        require: true
    },
    cName :{
        type: String,
        require: true
    },
    technology: {
        type: String,
        require: true
    },
    issue: {
        type: String,
        require: true
    }, 
    time : {
        type: String,
        require: true
    },
    image : {
        data:Buffer,
        contentType: String
    }
})
module.exports =  mongoose.model('TaskModel', taskSchema)