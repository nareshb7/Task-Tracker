const multer = require('multer')

const {signUpModel, currentUserModel} = require('../models/UsersModel')
const {deletedUsers}  =require('../models/TaskModel')


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
    const { value } = req.body
    let key = "email"
    if (value.match(/[\d]{10}/)){
        key = "mobile"
    }
    const result = await signUpModel.findOne({[key]: value })
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

module.exports.deleteUser = async (req, res) => {
    const { id } = req.body
    const result = await signUpModel.findByIdAndDelete({ _id: id })
    await deletedUsers.create({ user: result }).then(res => console.log('Delete sucess')).catch(err => console.log('delete error'))
    res.send(result)
}
module.exports.updateUser = async (req, res) => {
    const { id, updateValue, updateKey, update } = req.body
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