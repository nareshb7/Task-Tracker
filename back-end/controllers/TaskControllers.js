const multer = require('multer')
const fs = require('fs')
const {TaskModel, signUpModel, currentUserModel, currentID} = require('../models/TodoModel')

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
    upload(req,res,(err)=> {
        const {data} = req.body
        if(err){
            console.log(err)
        }else {
            const saveImage = new TaskModel({...data, image: req.file.filename})
            saveImage.save().then(()=> res.send('Issue Added Sucessfully')).catch(err=> res.send('Error Occured'))
        }
    })
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
    const {mobile, password} = req.body
    const result = await signUpModel.findOne({"mobile" : mobile, "password": password})
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

module.exports.setCurrentUserID = async (req,res)=> {
    const {id} = req.body
    await currentID.create({userID: id}).then(data=> res.send('User ID set')).catch(err=> res.send('User id not set'))
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
    const {mobile} = req.body
    const result = await TaskModel.find({mobile: mobile})
    res.send(result)
}