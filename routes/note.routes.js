const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Note = require('../models/Note.model');
const FlashCard = require('../models/FlashCard.model');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/isLoggedIn');

// Create Note GET and POST routes

router.get('/create-note/:flashcardId/:character', /* isLoggedIn , */ (req, res, next) => {
  res.render('notes/new-note', {flashcardId: req.params.flashcardId, characterId:req.params.character});
});

router.post('/create-note/:flashcardId/:character', /* isLoggedIn , */ (req, res, next) => {

  const { theTitle, theContent } = req.body;
  const flashcardId = req.params.flashcardId;
  console.log(flashcardId);
  const character = req.params.character;

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
    .then((flashC) => {
      console.log(flashC);
      const redirectURL = flashC.createdByUser ? `/flashCards/details/${flashcardId}` : `/${character}/details`;
      req.flash('success', 'Note created successfully');
      res.redirect(redirectURL);
    })
    .catch((error) => {
      next(error);
    })
  })
  .catch((error) => {
    next(error);
  })

  
});

// Display All Notes for the FlashCard
router.get('/see-notes/:flashcardID',  /* isLoggedIn , */ (req, res, next) => {
  const flashCardID = req.params.flashcardID;

  Note.find({ $and: [{belongToCard: flashCardID}, {composedByUser: req.session.currentUser._id}]})
  .then((notes) => {
    res.render('notes/notes-list', { notes });
  })
  .catch((error) => {
    next(error);
  })
});

// Update Note GET and POST route
router.get('/edit-note/:id', /* isLoggedIn , */ (req, res, next) => {
  Note.findById(req.params.id)
  .then((theNote) => {
    res.render('notes/note-edit', { theNote });
  })
  .catch((error) => {
    next(error);
  })
});

router.post('/update-note/:theID', /* isLoggedIn , */ (req, res, next) =>{

  Note.findByIdAndUpdate(req.params.theID, {
    title: req.body.theTitle,
    content: req.body.theContent
  })
  .then(() => {
    Note.findById(req.params.theID)
    .then((updatedNote) => {
      res.redirect(`/note/see-notes/${updatedNote.belongToCard}`)
    })
    .catch((error) => {
      next(error);
    });
  })
  .catch((error) => {
    next(error);
  })
});

// Delete Note POST route
router.post('/:id/delete-note', /* isLoggedIn , */ (req, res, next) => {
Note.findByIdAndDelete(req.params.id)
.then((deletedNote) => {
const flashCardId = deletedNote.belongToCard;
req.flash('success', 'Note deleted successfully');
res.redirect(`/note/see-notes/${flashCardId}`);
})
.catch((error) => {
  next(error);
})
})





module.exports = router;