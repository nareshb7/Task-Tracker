const multer = require('multer')
const nodemailer = require('nodemailer')

const fs = require('fs')
const {TaskModel, signUpModel, currentUserModel, currentID, deletedUsers} = require('../models/TodoModel')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'nareshsit7@gmail.com',
        pass: 'xdocuqqhhnlwyllg'
    }
})
const options = {
    from :'narehsit7@gmail.com',
    to:'',
    subject: 'Email Verification',
    text:'Verification Code is : '
}

// Storage Engine
const Storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null, 'uploads')
    },
    filename: (req,file, cb)=> {
        cb(null, `taskimage-${Date.now()}.${file.originalname}`)
    }
})
const upload = multer({
    storage : Storage
}).single('testImage')

module.exports.setData = async (req,res)=> {
    const {data} = req.body
    await TaskModel.create(data).then(data => res.send('Data Saved Sucessfully')).catch(err => res.send(err))
}
module.exports.addSolution = async (req,res)=> {
    const {newData, id} = req.body
    const result = await TaskModel.findByIdAndUpdate({_id:id},{'solutions': newData})
    res.send(result)
}
module.exports.deleteSolution = async (req,res)=> {
    const {id} = req.body
    const result = await TaskModel.findByIdAndDelete({_id: id})
    res.send(result)
}
// {data: fs.readFileSync("uploads/"+ req.file.filename), contentType:'image/jpg' }
module.exports.getData = async (req,res)=> {
    await TaskModel.find({})
    .then(data => res.json(data))
    .catch(err=> res.send(err))
    // await TaskModel.deleteMany()
}

//
const UserStorage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null, 'users')
    },
    filename: (req,file, cb)=> {
        cb(null, `image-${Date.now()}.${file.originalname}`)
    }
})
const signinStorage = multer({
    storage: UserStorage,
    limits: {
        fileSize: 1000000
    }
}).single('profileImage')

module.exports.signUpData = async (req,res)=> {
    signinStorage(req,res, (err)=> {
        const {data} = req.body
        if (err){
            console.log(err)
        }else {
            const saveImage = new signUpModel(data)
            saveImage.save().then(()=> res.send('Account Created Sucessfully')).catch(err=> res.send('Error Occured'))
        }
    })
}
// {data: fs.readFileSync("users/"+ req.file.filename), contentType:'image/jpg' }
module.exports.logInUserData = async (req,res)=> {
    const {mobile} = req.body
    const result = await signUpModel.findOne({"mobile" : mobile})
    res.send(result)
}

module.exports.setCurrentUser = async (req,res)=> {
    const { currentUser} = req.body
    await currentUserModel.deleteMany()
    const savedata =await new currentUserModel(currentUser)
    await savedata.save().then(()=> res.send('Login Sucessful')).catch(err=> res.send(err))
}

module.exports.getCurrentUser = async (req,res)=> {
    await currentUserModel.find({},{_id:0}).then(data=> res.send(data)).catch(err => res.send(err))  
}

module.exports.deleteCurrentUser = async (req,res) => {
    await currentUserModel.deleteMany().then(data=> res.send(data)).catch(err=> res.send(err))
}

module.exports.getParticularUser = async (req,res)=> {
    const {id} = req.body
    const result =await signUpModel.findOne({_id : id})
    res.send(result)
}
module.exports.getAllUsers = async (req,res)=> {
    const result = await signUpModel.find({})
    res.send(result)
}
module.exports.uploadedIssues = async (req,res)=> {
    const {email} = req.body
    const result = await TaskModel.find({email: email})
    res.send(result)
}
module.exports.mailVerification = async (req,res)=> {
    const {creds} = req.body
    const random = Math.random().toString(36).slice(2,10)
    const d = new Date().toLocaleString()
    options.to = creds.email
    options.text = `Your confirmation password is : " ${random} " please provide this code on http://localhost:3000/signup sent time : ${d}`
    // console.log(creds, 'creds', random)
    transporter.sendMail(options, (err, info)=> {
        if (err){
            res.send(err)
        }
        res.send({psd: random, message: 'OTP sent to ur mail'})
    })
}

module.exports.deleteUser = async (req,res)=> {
    const {id} = req.body
    const result = await signUpModel.findByIdAndDelete({_id : id})
    await deletedUsers.create(result).then(res=> console.log('Delete sucess')).catch(err=> console.log('delete error'))
    res.send(result)
}
module.exports.updateUser = async (req,res)=> {
    const {id, status, objectType } = req.body
    console.log(id, status, objectType, 'result')
    const result = await signUpModel.findByIdAndUpdate({_id : id},{[objectType]: status})
    res.send(result)
}