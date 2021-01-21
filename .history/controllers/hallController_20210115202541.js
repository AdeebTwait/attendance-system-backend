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
    
};