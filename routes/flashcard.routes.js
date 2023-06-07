const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const FlashCard = require('../models/FlashCard.model');
const isLoggedIn = require('../middleware/isLoggedIn');

// All User-created FlashCards GET routes
router.get('/all', /* isLoggedIn */ (req, res, next) => {
  FlashCard.find()
  .then((allCards) => {
    res.render('flashCards/all-flashCards', { allCards });
  })
  .catch((error) => {
    next(error);
  })
});

// FlashCard Details Page GET route
router.get('/flashCard-details/:theID', /* isLoggedIn */ (req, res, next) => {
FlashCard.findById(req.params.theID)
.then((theFlashCard) => {
  res.render('flashCards/flashCard-details', { theFlashCard });
})
.catch((error) => {
  next(error);
})
});

// Create New FlashCard GET and POST routes
// router.get('/create-flashCard', /* isLoggedIn */ (req, res, next) => {

// })



module.exports = router;

