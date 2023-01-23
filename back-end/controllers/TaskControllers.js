const multer = require('multer')
const fs = require('fs')
const TaskModel = require('../models/TodoModel')

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
            saveImage.save().then(()=> res.send('Image Added')).catch(err=> res.send('Error Image'))
        }
    })
}

module.exports.getData = async (req,res)=> {
    await TaskModel.find({})
    .then(data => res.json(data))
    .catch(err=> res.send(err))
    // await TaskModel.deleteMany()
}