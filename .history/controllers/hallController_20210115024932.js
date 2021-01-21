const Hall = require('../models/Hall');

exports.getAll = async (req, res) => {
    
};

exports.storeHall = async (req, res) => {
    const hall = await (new Hall(req.body).save());

    res.json(hall);
};