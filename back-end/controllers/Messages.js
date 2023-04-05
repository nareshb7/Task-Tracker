
const Messages = require('../models/Messages')

module.exports.messages = async (req,res)=> {
    const {data } = req.body
    const result = await Messages.create(data).then(response => response).catch(err => err)
    res.send(result)
    console.log(result,'response',  data)
}