const  { BotModel } = require("../models/botMessageModel") 

module.exports.botRequests = async (req,res)=> {
    try {
        const {request} = req.body
        const result = await BotModel.create(request).then(dt => dt).catch(err => err)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json(e)
    }
}
module.exports.getBotRequest = async (req,res) => {
    try {
        const data = await BotModel.find({})
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json(e)
    }
}