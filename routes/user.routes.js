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

// LOGIN GET route
router.get('/login', (req, res, next) => {
  res.render('users/login');
});

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  const username = req.body.username; 
  const password = req.body.password;

  console.log(username);
  console.log(password);

  if (username === '' || password === '') {
    res.render('users/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  };

  User.findOne({username: username})
  .then(gotUser => {
    if (!gotUser) {
      res.render('users/login', {
        errorMessage: 'Username is not registered. Try with other username.'
      });
      return;
    }

    else if (bcryptjs.compareSync(password, gotUser.password)) {
      //Save the user in session
      req.session.currentUser = gotUser;
      console.log('CURRENT USER =====> ', req.session.currentUser)
      res.redirect('/user/userprofile');

    } else {
      res.render('users/login', {errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));

});

// LOGOUT POST route
router.post('/logout', (req, res, next) => {
req.session.destroy();
res.redirect('/');
});

// User profile page GET route
router.get('/userprofile', (req, res, next) => {
  res.render('users/user-profile');
})










module.exports = router;