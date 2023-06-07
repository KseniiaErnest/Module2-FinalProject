const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const FlashCard = require('../models/FlashCard.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const uploader = require('../config/cloudinary');

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
router.get('/details/:theID', /* isLoggedIn */ (req, res, next) => {
FlashCard.findById(req.params.theID)
.then((theFlashCard) => {
  res.render('flashCards/flashCard-details', { theFlashCard });
})
.catch((error) => {
  next(error);
})
});

// Create New FlashCard GET and POST routes
router.get('/create-flashCard', /* isLoggedIn */ (req, res, next) => {
  res.render('flashCards/new-flashCard');
} )

router.post('/create-flashCard', /* isLoggedIn */ uploader.fields([
  {name: 'theAudio'},
  {name: 'theStrokeOrder'}
]), (req, res, next) => {
  const { theAudio, theStrokeOrder } = req.files;

FlashCard.create({
  kanji: req.body.theKanji,
  meaning: req.body.theMeaning,
  onyomi: req.body.theOnyomi,
  kunyomi: req.body.theKunyomi,
  strokes: req.body.theStrokes,
  grade: req.body.theGrade,
  examples: [{
    text: req.body.theText,
    audio: theAudio ? theAudio[0].path : null
  }],
  link: req.body.theLink,
  strokeOrder: theStrokeOrder ? theStrokeOrder[0].path : null
})
.then((response) => {
  req.flash('success', 'FlashCard Successfully Created');
  res.redirect('/flashCards/all');
})
.catch((error) => {
  req.flash('error', 'There was an error, please, try again.');
  next(error);
})
});

// Update FlashCard GET and POST route

router.get('/edit/:id', /* isLoggedIn */ (req, res, next) => {
  FlashCard.findById(req.params.id)
  .then((theCard) => {
    res.render('flashCards/update-flashCard', { theCard });
  })
  .catch((error) => {
    next(error);
  })
});

router.post('/update/:theID', /* isLoggedIn */ uploader.fields([
  {name: 'theAudio'},
  {name: 'theStrokeOrder'}
]),  (req, res, next) => {
  const { theAudio, theStrokeOrder } = req.files;

FlashCard.findByIdAndUpdate(req.params.theID, {
  kanji: req.body.theKanji,
  meaning: req.body.theMeaning,
  onyomi: req.body.theOnyomi,
  kunyomi: req.body.theKunyomi,
  strokes: req.body.theStrokes,
  grade: req.body.theGrade,
  examples: [{
    text: req.body.theText,
    audio: theAudio ? theAudio[0].path : null
  }],
  link: req.body.theLink,
  strokeOrder: theStrokeOrder ? theStrokeOrder[0].path : null
})
.then(() => {
  req.flash('success', 'Your FlashCard was updated successfully');
  res.redirect('/flashCards/details/'+req.params.theID);
})
.catch((error) => {
  next(error);
})
} )


// Delete FlashCard POST route
router.post('/delete/:theID', /* isLoggedIn */ (req, res, next) => {
  FlashCard.findByIdAndRemove(req.params.theID)
  .then(() => {
    req.flash('success', 'FlashCard was successfully deleted');
    res.redirect('/flashCards/all')
  })
  .catch((error) => {
    next(error);
  })
})



module.exports = router;
