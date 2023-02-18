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
        type:String,
        require: true
    },
    mobile: {
        type: Number,
        require:true
    },
    binaryData: {
        type: String,
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
    email : {
        type: String,
        require:true
    }
})


const signinSchema = mongoose.Schema({
    fName: {
        type:String,
        require:true
    },
    lName: {
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }, 
    mobile:{
        type:Number,
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
    binaryData : {
        type: String,
        require: true
    }, isActive: {
        type: Boolean,
        require: true
    }, isAdmin: {
        type:Boolean, 
        require: true
    }, reqforAdmin : {
        type: Boolean,
        require: true
    }, joinedDate : {
        type:Date,
        require: true
    },
    uploadedIssues : {
        type: Array,
        require: true
    },
    technologies: {
        type:Array,
        require: true
    }
})

const currentUserSchema = mongoose.Schema({
    currentUser : {
        type: String,
        require: true
    }
})
const currentuserID = mongoose.Schema({
    userID : {
        type: String,
        require: true
    }
})
const deletedUsers = mongoose.Schema({
    user: {
        type:Object,
        require: true
    }
})

module.exports.signUpModel = mongoose.model('UserData', signinSchema)
module.exports.TaskModel =  mongoose.model('solutions', taskSchema)
module.exports.currentUserModel = mongoose.model('CurrentUser', currentUserSchema)
module.exports.currentID = mongoose.model('currentUserID', currentuserID)
module.exports.deletedUsers = mongoose.model('deletedUserId', deletedUsers)