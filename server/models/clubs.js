const { required } = require('joi');
const mongoose = require('mongoose')

const clubsSchema = mongoose.Schema({
    clubData: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    },
    venueData: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model('Club', clubsSchema);