const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

// USER Signup GET and POST routes
router.get('/signup', (req, res, next) => {
  res.render('users/signup');
});

router.post('/signup', (req, res, next) => {

const username = req.body.username;
const email = req.body.email;
const password = req.body.password;

// make sure the user fill all mandatory fields
if (!username || !email || !password) {
  req.flash('error', 'Please, fill in all fields');
  res.redirect('/user/signup');
  return;
}

// Password Validation
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if (!regex.test(password)) {
  req.flash('error', 'Password must contain lowercase, capital, numerals, and special characters');
  res.redirect('/user/signup');
  return;
}

bcryptjs.getSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt))
.then(hashedPassword => {
  User.create({username: username, password: hashedPassword, email: email})
  .then(() => {
    req.flash('success', 'You successfully signed up')
    res.redirect('/');
  })
  .catch((error) => {
    if (error instanceof mongoose.Error) {
      req.flash('error', error.message)
      res.redirect('/user/signup')
    }
  })
})
.catch((error) => {
  next(error);
})
});










module.exports = router;