const multer = require('multer')
const nodemailer = require('nodemailer')
const fs = require('fs')
const { mailChangeReq } = require('../models/TaskModel')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nareshsit7@gmail.com',
        pass: 'xdocuqqhhnlwyllg'
    }
})
const options = {
    from: 'narehsit7@gmail.com',
    to: '',
    subject: 'Email Verification',
    html: ''
}


// Storage Engine
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `taskimage-${Date.now()}.${file.originalname}`)
    }
})
const upload = multer({
    storage: Storage
}).single('testImage')

// {data: fs.readFileSync("uploads/"+ req.file.filename), contentType:'image/jpg' }

module.exports.mailVerification = async (req, res) => {
    const { apiPayload } = req.body
    const random = Math.random().toString(36).slice(2, 10)
    const d = new Date().toLocaleString()
    options.to = apiPayload
    options.html = `<div>Your <i> OTP </i>is : <b> ${random} </b> sent time : ${d}</div>`
    transporter.sendMail(options, (err, info) => {
        if (err) {
            res.send(err)
        }
        res.send({ psd: random, message: 'OTP sent to ur mail' })
    })
}


module.exports.mailChangeReq = async (req,res)=> {
    const {user} = req.body
    if (user.updateKey == 'DELETE') {
        await mailChangeReq.findOneAndDelete({id:user.id}, {new:true})
        .then(data => res.send(data))
        .catch(err => res.send(err))
    } else {
        let previousData = await mailChangeReq.findOne({id: user.id})
    if(!previousData){
        await mailChangeReq.create({...user}).then(data => res.send('Request sent Sucessfully')).catch(err =>res.send(err))
    } else {
        res.send('You are already requested for mail Change')
    }
    }
    
}
module.exports.getmailchangeID = async (req,res)=> {
    await mailChangeReq.find({})
    .then(data => res.send(data))
    .catch(err => res.semd(err))
}