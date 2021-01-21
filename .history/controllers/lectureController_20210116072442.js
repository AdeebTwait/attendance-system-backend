const Lecture = require('../models/Lecture');
const User = require('../models/User');


exports.getAll = async (req, res) => {
    const lectures = await Lecture.find({});

    res.json(lectures);
};

exports.createLecture = async (req, res) => {
    const lecture = await (new Lecture(req.body)).save();

    res.json(lecture);
};

exports.updateLecture = async (req, res) => {
    const lecture = await Lecture.findOneAndUpdate({ _id: req.params.id} , req.body, {
        new: true, // return the new lecture instead of the old one
        runValidators: true
    }).exec();

    res.json(lecture);
};

exports.addStudentsToLecture = async (req, res) => {
    console.error(req.body);
    const lecture = await Lecture.findOneAndUpdate( req.params.id , 
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

    res.json(lecture);
};

exports.deleteStudentFromLecture = async (req, res) => {
    console.error(req.body);
    const lecture = await Lecture.findOneAndUpdate( req.params.id ,
        {
            $pull: {students: { universityID: req.body.universityID } },
        },
        {
            new: true,
        }).exec();

        res.json(lecture);
    };
    

exports.deleteLecture = async (req, res) => {
    await Lecture.findByIdAndRemove(req.params.id);

    res.json({ message: "Lecture deleted successfully!" });
};