const {Router} = require('express')
const multer = require('multer')
// const fs = require('fs')
const TaskModel = require('../models/TodoModel')
const { setData, getData, uploads } = require('../controllers/TaskControllers')


const router = Router()

// Storage Engine
// const Storage = multer.diskStorage({
//     destination: (req,file,cb)=> {
//         cb(null, 'uploads')
//     },
//     filename: (req,file, cb)=> {
//         cb(null, file.originalname)
//     }
// })
// const upload = multer({
//     storage : Storage
// })

// router.post('/setData',upload.single('testImage'), (req,res)=> {
//     const {data} = req.body
//     const saveImage = new TaskModel({...data, image: {data: fs.readFileSync("uploads/"+ req.file.filename), contentType:'image/png' }})
//     saveImage.save().then(()=> res.send('Image Added')).catch(err=> res.send('Error Image'))
// })
router.post('/setData', setData)
router.get('/getData', getData)
router.post('/signup', signUpUser)

module.exports = router