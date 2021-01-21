const mongoose = require('mongoose');
const Lecture = require('../models/Lecture');
const User = require('../models/User');
const promisify = require('es6-promisify');

exports.createLecture = async (req, res) => {
    const lecture = await (new Lecture(req.body)).save();
    res.json({
        code: 200,
        message: "Lecture created successfully!",
        data: lecture,
    });
};

exports.addTeacherToLecture = async (req, res) => {
    const lecture = await Lecture.findOneAndUpdate({ courseNumber: req.params.courseNumber }, req.body, {
        new: true, // return the new lecture instead of the old one
        runValidators: true
    }).exec();

    res.json(lecture);
};

exports.addStudentsToLecture = async (req, res) => {
    console.error(req.body);
    const lecture = await Lecture.findOneAndUpdate({ courseNumber: req.params.courseNumber }, 
        {
            $push: {
                students: {
                    $each: req.body,
                }
            }
        }, 
        {
            new: true,
            runValidators: true
    }).exec();

    res.json({
        code: 200,
        message: "Students have been added successfully!",
        data: lecture,
    });
};

exports.deleteStudentFromLecture = async (req, res) => {
    console.error(req.body);
    const lecture = await Lecture.findOneAndUpdate({ courseNumber: req.params.courseNumber },
        {
            $pull: {students: { universityID: req.body.universityID } },
        },
        {
            new: true,
        }).exec();

    res.json({
        code: 200,
        message: "The student has been deleted successfully!",
        data: lecture,
    });
};