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
        type: Date,
        require: true
    },
    image : {
        type:String,
        require: true
    },
    binaryData: {
        type: Array,
        require: true
    },
    issueTitle: {
        type:String,
        require: true
    },
    solutions: {
        type:Array,
        require: true
    },
    companyName : {
        require: true,
        type: String
    },
    appType : {
        type:String,
        require: true
    },
    developerId : {
        type: String,
        require:true
    },
    issueStatus: {
        type:String,
        require: true
    },
    helpedDev: {
        type:Object,
        require: true
    }

})

module.exports.TaskModel =  mongoose.model('solutions', taskSchema)
