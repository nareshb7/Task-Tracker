const mongoose = require('mongoose')

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

module.exports.signUpModel = mongoose.model('UserData', signinSchema)
module.exports.currentUserModel = mongoose.model('CurrentUser', currentUserSchema)