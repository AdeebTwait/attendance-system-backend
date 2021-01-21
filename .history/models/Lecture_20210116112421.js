const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const lectureSchema = new Schema({
    courseName: {
        type: String,
        required: 'Please Supply an course name'
    },
    courseNumber: {
        type: Number,
        required: 'Please supply a course number',
        unique: true,
        trim: true
    },
    startTime: {
        type: String,
        required: 'Please supply a start time',
        trim: true
    },
    endTime: {
        type: String,
        required: 'Please supply a end time',
        trim: true
    },
    allowedAbsences: {
        type: Number,
        default: 7,
        trim: true
    },
    teacher : {
        type: String
    },
    hallNumber : {
        type: String
    },
    students: { type: Array, "default": [] },
});

module.exports = mongoose.model('Lecture', lectureSchema);
