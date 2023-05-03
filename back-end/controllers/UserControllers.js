const multer = require('multer')
const bcrypt = require('bcrypt')

const { signUpModel } = require('../models/UsersModel')
const { deletedUsers } = require('../models/TaskModel')


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
    const { data } = req.body
    data.password = await bcrypt.hash(data.password, 10)
    await signUpModel.create(data).then(data => res.status(200).send(data)).catch(err => res.status(401).send(err))
}
// {data: fs.readFileSync("users/"+ req.file.filename), contentType:'image/jpg' }
module.exports.logInUserData = async (req, res) => {
    const { value, password } = req.body
    let key = "email"
    if (value.match(/[\d]{10}/)) {
        key = "mobile"
    }
    const result = await signUpModel.findOne({ [key]: value })
    if (result) {
        result.status = 'Online'
        await result.save()
        const isValid = await bcrypt.compare(password, result.password) || result.password == password
        if (isValid) {
            res.status(200).json(result)
        } else res.status(401).json('Invalid Password')
    } else {
        res.status(404).json('User Not found')
    }
}

module.exports.getParticularUser = async (req, res) => {
    const { id } = req.body
    const result = await signUpModel.findOne({ _id: id })
    if (result) {

        result.status = 'Online'
        await result.save()
    }
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
        await signUpModel.findOneAndUpdate({ _id: id }, updateValue, { new: true })
            .then(data => {
                res.send(data)
            })
            .catch(err => res.send(err))
    } else {
        console.log('User Update::', updateKey, updateValue)
        await signUpModel.findOneAndUpdate({ _id: id }, { $set: { [updateKey]: updateValue } }, { new: true })
            .then((err, user) => {
                if (err) {
                    res.send(err)
                }
                res.send(user)
            })
    }
}
module.exports.userLogout = async (req, res) => {
    const { _id, newMessages, status } = req.body
    const result = await signUpModel.findById({ _id })
    console.log('newMessages', newMessages)
    if (result) {
        result.newMessages = newMessages || {}
        result.status = status
        result.lastActiveOn = new Date()
        await result.save()
        console.log('Logout::', _id)
    }
    res.send(result)
}