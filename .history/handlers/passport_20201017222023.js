const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
// const User = mongoose.model('User');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
