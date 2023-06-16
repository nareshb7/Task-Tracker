const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    label: {
        type: String,
        require: true
    },
    name: {
        type:String,
        require: true
    }
}, {timestamps: true})
module.exports.ActivityModel = mongoose.model('User Activity', activitySchema)