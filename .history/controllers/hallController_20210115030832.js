const Hall = require('../models/Hall');

exports.getAll = async (req, res) => {
    const halls = await Hall.find({})  ;

    console.log(halls)
    res.json(halls);
};

exports.storeHall = async (req, res) => {
    const hall = await (new Hall(req.body).save());

    res.json(hall);
};