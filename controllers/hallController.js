const Hall = require('../models/Hall');

exports.getAll = async (req, res) => {
    const halls = await Hall.find({})  ;

    res.json(halls);
};

exports.storeHall = async (req, res) => {
    const hall = await (new Hall(req.body).save());

    res.json(hall);
};

exports.deleteHall = async (req, res) => {
    await Hall.findByIdAndRemove(req.params.id);

    res.json({ message: "Hall deleted successfully!" });
};

exports.updateHall = async (req, res) => {
    const hall = await Hall.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return the new hall instead of the old one
        runValidators: true
    }).exec();

    res.json(hall);
};