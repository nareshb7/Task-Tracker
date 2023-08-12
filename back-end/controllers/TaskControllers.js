const multer = require('multer')
const nodemailer = require('nodemailer')
const fs = require('fs')
const express = require('express')
const { mailChangeReq, contactUsModel } = require('../models/TaskModel')
const FilesModel = require('../models/UploadFilesModel')
const axios = require('axios')

const storage = multer.memoryStorage()
module.exports.uploadFileStorage = multer({ storage })

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

module.exports.clientUpdateSend = async (req, res) => {
    const { subject, email, description } = req.body
    console.log('MAIL UPDATE', subject, email, description)
    options.to = email
    options.subject = subject
    options.html = description
    transporter.sendMail(options, (err, info) => {
        if (err) {
            res.send(err)
        }
        res.send('Mail sent')
    })
}

module.exports.mailChangeReq = async (req, res) => {
    const { user } = req.body
    if (user.updateKey == 'DELETE') {
        await mailChangeReq.findOneAndDelete({ id: user.id }, { new: true })
            .then(data => res.send(data))
            .catch(err => res.send(err))
    } else {
        let previousData = await mailChangeReq.findOne({ id: user.id })
        if (!previousData) {
            await mailChangeReq.create({ ...user }).then(data => res.send('Request sent Sucessfully')).catch(err => res.send(err))
        } else {
            res.send('You are already requested for mail Change')
        }
    }

}
module.exports.getmailchangeID = async (req, res) => {
    await mailChangeReq.find({})
        .then(data => res.send(data))
        .catch(err => res.semd(err))
}
const getRandom = (data = 1642) => {
    const num = Math.floor(Math.random() * ((data - 2) + 1))
    console.log('number', num)
    return num
}
let d = new Date().toLocaleDateString()
let num = getRandom()

module.exports.getQuote = async (req, res) => {
    const { date } = req.query
    const quotes = await fetch('https://type.fit/api/quotes').then(res => res.json())
    const userDate = new Date(date).toLocaleDateString()
    if (userDate == d) {
        return res.status(200).json(quotes[num])
    } else {
        num = getRandom()
        d = new Date().toLocaleDateString()
        return res.status(200).json(quotes[num])
    }
}

module.exports.contactusData = async (req, res) => {
    const result = await contactUsModel.find({})
    res.status(200).json(result)
}
module.exports.addContactUsData = async (req, res) => {
    console.log('REQ', req.body)
    const { data } = req.body
    await contactUsModel.create(data)
        .then(data => res.status(200).json(data))
        .catch(e => res.status(400).json(e.message))
    // await contactUsModel.deleteMany({}) 
}
const getLatestNews = async () => {
    const options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: { q: 'India Tech', lang: 'en', sort_by: 'relevancy', page: '1' },
        headers: {
            'x-api-key': 'zGl39be9NfvTx9Vc_QYI41RvnIU3hsssJwI0ymnBV4'
        }
    };
    console.log('GETLATESTNEWS')
    return await axios.request(options).then(function (response) {
        return response.data.articles
    }).catch(function (error) {
        return error
    });
}
let newsData = new Promise(async (resolve, reject) => {
    const val = await getLatestNews()
    try {
        if (val.length) {
            resolve(val)
        }
    } catch (e) {
        reject(val)
    }

})
module.exports.getNews = async (req, res) => {
    const { date } = req.query
    const userDate = new Date(date).toLocaleDateString()
    // if (userDate == d){
    //     newsData.then(d=> res.status(200).json(d)).catch(e=> res.status(400).json(e))
    // } else {
    //     // newsData = getLatestNews()
    //     newsData.then(d=> res.status(200).json(d)).catch(e=> res.status(400).json(e))
    // }
    res.status(200).json('SUCCESS')

}
const types = ['image/jpeg', 'application/pdf', 'application/x-zip-compressed', 'image/png']
module.exports.uploadFile = async (req, res) => {
    try {
        const { originalname, buffer, mimetype, size } = req.file;
        console.log('FILE', req.file)

        if (!types.includes(mimetype)) {
            throw new Error('Invalid file type')
        }
        if (size > 1300000) {
            throw new Error('Not more than 1MB')
        }
        const isAlready = await FilesModel.findOne({ data: buffer })
        if (isAlready) {
            console.log('ISALRDY', isAlready)
            res.status(200).json(isAlready)
        } else {
            const newFile = new FilesModel({
                fileName: originalname,
                data: buffer
            })
            newFile.save()
            res.send(newFile)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

module.exports.getFileFromDB = async (req, res) => {
    try {
        const { id } = req.query
        console.log('ID', id)
        const file = await FilesModel.findOne({ _id: id })
        if (file) res.status(200).json(file.data)
        else {
            throw new Error('while getting file error occured')
        }
    } catch (e) {
        res.status(400).json(e.message)
    }
}
