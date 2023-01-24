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


const signinSchema = mongoose.Schema({
    uName: {
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }, 
    mobile:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require:true
    },
    conPassword: {
        type:String,
        require: true
    },
    profileImage : {
        data: Buffer,
        contentType:String
    }
})

module.exports = SignUpSchema = mongoose.model('UserData', signinSchema)
module.exports = TaskModel =  mongoose.model('TaskModel', taskSchema)