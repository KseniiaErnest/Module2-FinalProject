const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
const FlashCard = require('../models/FlashCard.model');
const isLoggedIn = require('../middleware/isLoggedIn');

// USER Signup GET and POST routes
router.get('/signup', (req, res, next) => {
  res.render('users/signup');
});

router.post('/signup', (req, res, next) => {

const username = req.body.username;
const email = req.body.email;
const password = req.body.password;

// All fields are mandatory
if (!username || !email || !password) {
  res.render('users/signup', {errorMessage: "All fields are mandatory. Please provide your username, email and password."});
  return;
};

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if (!regex.test(password)) {
  req.flash('error', 'Password must contain lowercase, capital, numerals, and special characters');
  res.redirect('/user/signup');
  return;
};


bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      /*return*/ User.create({ username, email, password: hashedPassword });
    })
    .then(() => {
      req.flash("success", "Sign-up was successful");
      res.redirect('/user/userprofile');
    })
    .catch((error)  => {
if (error instanceof mongoose.Error) {
  req.flash("error", error.message);
  res.redirect('/signup');
}
    })
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
      req.flash('error', 'Username Not Found');
      res.redirect('/user/login');
      return;
    } else if (bcryptjs.compareSync(password, gotUser.password)) {
      //Save the user in session
      req.session.currentUser = gotUser;
      req.flash('success', 'Successfully Logged In');
      res.redirect('/user/userprofile');
    } else {
      req.flash('error', "Password do not match");
      res.redirect('/user/login');
    }
  })
  .catch(error => next(error));

});

// LOGOUT POST route
router.post('/logout', isLoggedIn, (req, res, next) => {
req.session.destroy();
res.redirect('/');
});

// User profile page GET route
router.get('/userprofile', (req, res, next) => {
  res.render('users/user-profile');
})


// User flashCard page
// router.get('/userprofile', isLoggedIn, (req, res, next) => {
//   User.findById(req.session.currentUser._id).populate('flashCards')
//   .then((theUserObject) => {
//     res.render('users/user-profile', { theUserObject: theUserObject });
//   })
//   .catch((error) => {
//     next(error);
//   })
// });







module.exports = router;