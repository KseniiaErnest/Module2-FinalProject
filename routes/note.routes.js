const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Note = require('../models/Note.model');
const FlashCard = require('../models/FlashCard.model');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/isLoggedIn');

// Create Note GET and POST routes

router.get('/create-note/:flashcardId', /* isLoggedIn , */ (req, res, next) => {
  res.render('notes/new-note', {flashcardId: req.params.flashcardId});
});

router.post('/create-note/:flashcardId', /* isLoggedIn , */ (req, res, next) => {

  const { theTitle, theContent } = req.body;
  const flashcardId = req.params.flashcardId;

  Note.create({
    title: theTitle,
    content: theContent,
    belongToCard: flashcardId,
    composedByUser: req.session.currentUser._id,
  })
  .then((createdNote) => {
    FlashCard.findByIdAndUpdate(flashcardId, {
      $push: {notes: createdNote._id}
    })
    .then(() => {
      req.flash('success', 'Note created successfully');
      res.redirect(`/flashCards/flashCard-details/${flashcardId}`);
    })
    .catch((error) => {
      next(error);
    })
  })
  .catch((error) => {
    next(error);
  })

  
});





module.exports = router;