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

bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({ username, email, password: hashedPassword });
    })
    .then(userFromDB => {
      res.redirect('/user/userprofile');
    })
    .catch(error => next(error));
});

// User profile page GET route
router.get('/userprofile', (req, res, next) => {
  res.render('users/user-profile');
})










module.exports = router;