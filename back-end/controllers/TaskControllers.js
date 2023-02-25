const multer = require('multer')
const nodemailer = require('nodemailer')

const fs = require('fs')
const { TaskModel, signUpModel, currentUserModel, currentID, deletedUsers, mailChangeReq } = require('../models/TodoModel')

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
    text: 'Verification Code is : '
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

module.exports.setData = async (req, res) => {
    const { data } = req.body
    await TaskModel.create(data).then(data => res.send('Data Saved Sucessfully')).catch(err => res.send(err))
}
module.exports.getData = async (req, res) => {
    await TaskModel.find({})
        .then(data => res.json(data))
        .catch(err => res.send(err))
    // await TaskModel.deleteMany()
}
module.exports.addSolution = async (req, res) => {
    const { newData, id } = req.body
    const result = await TaskModel.findByIdAndUpdate({ _id: id }, { 'solutions': newData }, { new: true })
    res.send(result)
}
module.exports.deleteSolution = async (req, res) => {
    const { id } = req.body
    const result = await TaskModel.findByIdAndDelete({ _id: id }, { new: true })
    res.send(result)
}
module.exports.updateSolution = async (req,res)=> {
    const {updateData, prevId, updateKey} = req.body
    const result = await TaskModel.updateMany({[updateKey]: prevId},{$set : {[updateKey]: updateData }})
    res.send(result)
}

// {data: fs.readFileSync("uploads/"+ req.file.filename), contentType:'image/jpg' }


//
const UserStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'users')
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}.${file.originalname}`)
    }
})
const signinStorage = multer({
    storage: UserStorage,
    limits: {
        fileSize: 1000000
    }
}).single('profileImage')

module.exports.signUpData = async (req, res) => {
    signinStorage(req, res, (err) => {
        const { data } = req.body
        if (err) {
            console.log(err)
        } else {
            const saveImage = new signUpModel(data)
            saveImage.save().then(() => res.send('Account Created Sucessfully')).catch(err => res.send('Error Occured'))
        }
    })
}
// {data: fs.readFileSync("users/"+ req.file.filename), contentType:'image/jpg' }
module.exports.logInUserData = async (req, res) => {
    const { mobile } = req.body
    const result = await signUpModel.findOne({ "mobile": mobile })
    res.send(result)
}

module.exports.setCurrentUser = async (req, res) => {
    const { currentUser } = req.body
    await currentUserModel.deleteMany()
    const savedata = await new currentUserModel(currentUser)
    await savedata.save().then(() => res.send('Login Sucessful')).catch(err => res.send(err))
}

module.exports.getCurrentUser = async (req, res) => {
    await currentUserModel.find({}, { _id: 0 }).then(data => res.send(data)).catch(err => res.send(err))
}

module.exports.deleteCurrentUser = async (req, res) => {
    await currentUserModel.deleteMany().then(data => res.send(data)).catch(err => res.send(err))
}

module.exports.getParticularUser = async (req, res) => {
    const { id } = req.body
    const result = await signUpModel.findOne({ _id: id })
    res.send(result)
}
module.exports.getAllUsers = async (req, res) => {
    const result = await signUpModel.find({})
    res.send(result)
}
module.exports.uploadedIssues = async (req, res) => {
    const { developerId } = req.body
    const result = await TaskModel.find({ developerId })
    res.send(result)
}
module.exports.mailVerification = async (req, res) => {
    const { creds } = req.body
    const random = Math.random().toString(36).slice(2, 10)
    const d = new Date().toLocaleString()
    options.to = creds.email || creds.updateValue
    options.text = `Your confirmation password is : <b>" ${random} "</b> please provide this code on http://localhost:3000/signup sent time : ${d}`
    transporter.sendMail(options, (err, info) => {
        if (err) {
            res.send(err)
        }
        res.send({ psd: random, message: 'OTP sent to ur mail' })
    })
}

module.exports.deleteUser = async (req, res) => {
    const { id } = req.body
    const result = await signUpModel.findByIdAndDelete({ _id: id })
    await deletedUsers.create({ user: result }).then(res => console.log('Delete sucess')).catch(err => console.log('delete error'))
    res.send(result)
}
module.exports.updateUser = async (req, res) => {
    const { id, updateValue, updateKey, update } = req.body
    // await signUpModel.findByIdAndUpdate({_id : id},{[updateKey]: updateValue})
    // .then(data => res.send(data))
    // .catch(err => res.send(err))
    if (update == 'MULTIPLE') {
        await signUpModel.findOneAndUpdate({ _id: id },updateValue, { new: true })
            .then(data => {
                res.send(data)
            })
            .catch(err => res.send(err))
    } else {
        await signUpModel.findOneAndUpdate({ _id: id }, { $set: { [updateKey]: updateValue } }, { new: true })
            .then((err, user) => {
                if (err) {
                    res.send(err)
                }
                res.send(user)
            })
    }
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