
const { TaskModel } = require('../models/IssueModel')

module.exports.setData = async (req, res) => {
    const { data } = req.body
    await TaskModel.create(data).then(data => res.send('Data Saved Sucessfully')).catch(err => res.send(err))
}
module.exports.getData = async (req, res) => {
    await TaskModel.find({})
        .then(data => res.json(data))
        .catch(err => res.send(err))
    // await TaskModel.deleteMany()
}
module.exports.addSolution = async (req, res) => {
    const { newData, id, mode } = req.body
    if (mode) {
        const result = await TaskModel.findByIdAndUpdate({ _id: id },  newData , {new: true})
        res.send(result)
    } else {
        const result = await TaskModel.findByIdAndUpdate({ _id: id }, { 'solutions': newData }, { new: true })
        res.send(result)
    }
}
module.exports.deleteSolution = async (req, res) => {
    const { id } = req.body
    const result = await TaskModel.findByIdAndDelete({ _id: id }, { new: true })
    res.send(result)
}
module.exports.updateSolution = async (req, res) => {
    const { updateData, prevId, updateKey } = req.body
    const result = await TaskModel.updateMany({ [updateKey]: prevId }, { $set: { [updateKey]: updateData } })
    res.send(result)
}

module.exports.uploadedIssues = async (req, res) => {
    const { developerId } = req.body
    const result = await TaskModel.find({ developerId })
    res.send(result)
}

module.exports.getParticularSolution = async (req, res) => {
    const { id } = req.body
    const result = await TaskModel.findOne({ _id: id })
    res.send(result)
}

module.exports.issueStatus = async (req, res) => {
    const { id, value } = req.body
    const result = await TaskModel.findByIdAndUpdate({ _id: id }, { "issueStatus": value }, { new: true })
    res.send(result)
}