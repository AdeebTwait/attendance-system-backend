const mongoose = require('mongoose');
const User = require('../models/User');
const Lecture = require('../models/Lecture');
const Entry = require('../models/Entry');
const Hall = require('../models/Hall');
const promisify = require('es6-promisify');

exports.storeEntry = async (req, res) => {
    const student = await User.findOne({ fingerprint: req.body.fingerprint });
    let date = new Date();
    let current_time = date.getHours() + ":" + date.getMinutes();
    const course = await Lecture.findOne({ 
        startTime: { $lte: current_time },
        endTime: { $gte: current_time },
    });


    const entry = await (new Entry({
        studentName: student.name,
        studentID: student.universityID,
        courseNumber: course.courseNumber,
        entryTime: date.toLocaleString(),
    })).save();

    console.log({
        'code': '200',
        'message': 'New entry by date: ' + Date.now(),
    });
};

exports.newHall = async (req, res) => {
    const hall = await (new Hall(req.body).save());

    res.json({
        'code': '200',
        'message': 'success',
    });
};