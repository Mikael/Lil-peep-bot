const mongoose = require('mongoose');

const imagesSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sendImages: Boolean,
    imageChannel: String,
    timerInSec: Number,
})

module.exports = mongoose.model('images-settings', imagesSchema)