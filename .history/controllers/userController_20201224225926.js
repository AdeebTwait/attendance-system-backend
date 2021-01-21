const mongoose = require('mongoose');
const User = require('../models/User');
const PubNub = require('pubnub');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
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
    res.send(errors.map(err => err.msg))
    // req.flash('error', errors.map(err => err.msg));
    // res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User({ 
    email: req.body.email, 
    name: req.body.name, 
    type: req.body.type,
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
        await register(user, req.body.password);
        res.send({
          'code' : '200',
          'message': 'success',
        });
      },
    })
  } else {
      await register(user, req.body.password);
      res.send({
        'code': '200',
        'message': 'success',
      });
  }
    
    
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};
