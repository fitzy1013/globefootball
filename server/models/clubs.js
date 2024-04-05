const { required } = require('joi');
const mongoose = require('mongoose')

const clubsSchema = mongoose.Schema({
    Team : {
        type: String,
        required: true
    },
    FDCOUK : {
        type: String,
        required: true
    },
    City : {
        type: String,
        required: true
    },
    Stadium : {
        type: String,
        required: true
    }, 
    Capacity : {
        type: Number,
    },
    Latitude : {
        type: Number,
        required: true
    },
    Longitude : {
        type: Number,
        required: true
    },
    Country : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Clubs', clubsSchema)