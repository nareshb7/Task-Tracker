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
        require:true,
        unique: true,
        dropDups:true
    }, 
    mobile:{
        type:Number,
        require: true,
        unique:true,
        dropDups:true
    },
    password:{
        type:String,
        require:true
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
    },
    status : {
        type:String,
        default: 'Online'
    },
    newMessages : {
        type:Object,
        default: {}
    },
    designation : String,
    lastActiveOn : {
        type: Date,
        require: true,
        default: new Date()
    },
    todayTickets: {
        type: Array,
        default:[],
    },
    userId : {
        type:String,
        require: true,
        unique:true,
        dropDups:true
    },
    userLevel: {
        type:Number,
        require: true
    },
    dob: {
        type:Date,
        require: true
    }
}, {minimize: false, timestamps: true})
module.exports.signUpModel = mongoose.model('UserData', signinSchema)