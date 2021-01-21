const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const entrySchema = new Schema({
    studentName: {
        type: String,
        required: 'Please Supply a student name'
    },
    studentID: {
        type: String,
        required: 'Please supply a student ID',
        trim: true
    },
    courseNumber: {
        type: Number,
        required: 'Please supply a course number',
        trim: true
    },
    entryTime: {
        type: String,
        default: Date.now(),
        required: 'Please supply the entry time',
    },
});

module.exports = mongoose.model('Entry', entrySchema);
