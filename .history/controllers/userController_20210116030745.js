const mongoose = require('mongoose');
const User = require('../models/User');
const PubNub = require('pubnub');
const promisify = require('es6-promisify');
const bcrypt = require('bcryptjs');


exports.getAll = async (req, res) => {
  const users = await User.find({});

  res.json(users);
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('type', 'User Type Cannot be Blank!').notEmpty();
  req.checkBody('universityID', 'University ID Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    res.json(errors.map(err => err.msg))
    // req.flash('error', errors.map(err => err.msg));
    // res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const salt = await bcrypt.salt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({ 
    email: req.body.email, 
    name: req.body.name, 
    type: req.body.type,
    password: hashedPassword,
    universityID: req.body.universityID,
  });

  const register = promisify(User.register, User);
  
  if (user.type == 'Student') {
    let pubnub = new PubNub({
      publishKey: process.env.publish_key,
      subscribeKey: process.env.subscribe_key,
    })
    
    let payload = {
      message: 'fingerprint_enroll',
      channel: 'finger_request'
    }
    
    pubnub.publish(payload)
    
    pubnub.subscribe({
      channels: ["finger_response"],
    });

    pubnub.addListener({
      message: async function (message) {
        if (message.message.includes('error')) {
          res.send({
            'error': '500',
            'message': message.message,
          });
          throw Error(message.message);
        }
        user.fingerprint = message.message;
        await user.save();
        res.send(user);
      },
    })
  } else {
      await user.save();
      res.send(user);
  }
    
    
};

exports.updateUser = async (req, res) => {
  const user = await User.findOneAndUpdate(req.params.id, req.body, {
    new: true, // return the new user instead of the old one
    runValidators: true
  }).exec();

  res.json(user);
};

exports.deleteLecture = async (req, res) => {
  await User.findByIdAndRemove(req.params.id);

  res.json({ message: "User deleted successfully!" });
};
