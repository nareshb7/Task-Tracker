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
    },
    reqforMailChange: {
        type: Boolean,
        require: true
    },
    gender: {
        type: String,
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
const mailChangeReq = mongoose.Schema({
    id: {
        type:String,
        require:true
    },
    updateKey: {
        type:String,
        require:true
    },
    updateValue: {
        type:String,
        require:true
    }
})

module.exports.signUpModel = mongoose.model('UserData', signinSchema)
module.exports.TaskModel =  mongoose.model('solutions', taskSchema)
module.exports.currentUserModel = mongoose.model('CurrentUser', currentUserSchema)
module.exports.currentID = mongoose.model('currentUserID', currentuserID)
module.exports.deletedUsers = mongoose.model('deletedUserId', deletedUsers)
module.exports.mailChangeReq = mongoose.model('mailChangeReqUser', mailChangeReq)