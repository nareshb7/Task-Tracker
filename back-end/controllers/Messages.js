
const Messages = require('../models/Messages')

module.exports.messages = async (req,res)=> {
    const {from , to, messages } = req.body
    const result = await Messages.create(from,to, messages).then(response => response).catch(err => err)
    res.send(result)
    console.log('response',  from, to)
}