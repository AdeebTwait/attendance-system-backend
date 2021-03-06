const mongoose = require('mongoose');
const Hall = require('../models/Hall');
const promisify = require('es6-promisify');

exports.newHall = async (req, res) => {
    const hall = await (new Hall(req.body).save());

    res.json(hall);
};