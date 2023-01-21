const TaskModel = require('../models/TodoModel')

module.exports.setData = async (req,res)=> {
    const {data} = req.body
    await TaskModel.create(data)
    .then(data => res.send(data))
    .catch(err=> res.send(err))
}

module.exports.getData = async (req,res)=> {
    await TaskModel.find({})
    .then(data => res.send(data))
    .catch(err=> res.send(err))
}