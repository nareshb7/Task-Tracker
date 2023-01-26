const multer = require('multer')
const fs = require('fs')
const {TaskModel, signUpModel, currentUserModel} = require('../models/TodoModel')

// Storage Engine
const Storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null, 'uploads')
    },
    filename: (req,file, cb)=> {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage : Storage
}).single('testImage')

module.exports.setData = async (req,res)=> {
    upload(req,res,(err)=> {
        const {data} = req.body
        if(err){
            console.log(err)
        }else {
            const saveImage = new TaskModel({...data, image: {data: fs.readFileSync("uploads/"+ req.file.filename), contentType:'image/jpg' }})
            saveImage.save().then(()=> res.send('Issue Added Sucessfully')).catch(err=> res.send('Error Occured'))
        }
    })
}

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
        cb(null, file.originalname)
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
        console.log(req.file, 'file')
        if (err){
            console.log(err)
        }else {
            const saveImage = new signUpModel({...data, profileImage: {data: fs.readFileSync("users/"+ req.file.filename), contentType:'image/jpg' }})
            saveImage.save().then(()=> res.send('Account Created Sucessfully')).catch(err=> res.send('Error Occured'))
        }
    }) 
}

module.exports.logInUserData = async (req,res)=> {
    const {mobile, password} = req.body
    await signUpModel.findOne({mobile : mobile, password: password}).then(data => res.send(data)).catch(err => res.send(err))
    // await signUpModel.deleteMany()
}

module.exports.setCurrentUser = async (req,res)=> {
    const { currentUser} = req.body
    await currentUserModel.deleteMany()
    const savedata =await new currentUserModel({currentUser})
    await savedata.save().then(()=> res.send('added user')).catch(err=> res.send(err))
    
    
}

module.exports.getCurrentUser = async (req,res)=> {
    await currentUserModel.find({}).then(data=> res.send(data)).catch(err=> res.send(err))
    
}