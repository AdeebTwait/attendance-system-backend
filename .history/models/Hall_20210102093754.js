const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const hallSchema = new Schema({
    hallNumber: {
        type: String,
        required: 'Please Supply a student name'
    },
    hallDescription: {
        type: String,
    },
    courseNumber: {
        type: Number,
        required: 'Please supply a course number',
        trim: true
    },
});

module.exports = mongoose.model('Hall', hallSchema);
