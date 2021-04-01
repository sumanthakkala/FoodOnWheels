const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Categories', CategorySchema)