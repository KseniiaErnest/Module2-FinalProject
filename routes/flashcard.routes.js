const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const FlashCard = require('../models/FlashCard.model');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const uploader1 = require('../config/cloudinary.image')
const uploader2 = require('../config/cloudinary.video');



// All User-created FlashCards GET routes

router.get('/all', isLoggedIn, (req, res, next) => {

  FlashCard.find({ $and: [ {createdBy: req.session.currentUser._id}, {createdByUser: true} ]})
  .then(createdByUserFlashCards => {
    FlashCard.find({ $and: [ {createdBy: req.session.currentUser._id}, {createdByUser: false} ]})
    .then(kanjiFromApi => {
      res.render('flashCards/all-flashCards', {createdByUserFlashCards, kanjiFromApi});
    })
    .catch((error) => {
      next(error);
    })
  })
  .catch((error) => {
    next(error);
  })
})


// FlashCard Details Page GET route
router.get('/details/:theID', isLoggedIn, (req, res, next) => {
FlashCard.findById(req.params.theID)
.then((theFlashCard) => {
  res.render('flashCards/flashCard-details', { theFlashCard });
})
.catch((error) => {
  next(error);
})
});

// Create New FlashCard GET and POST routes

router.get('/create-flashCard', isLoggedIn , (req, res, next) => {
  res.render('flashCards/new-flashCard');
} );

router.post('/create-flashCard', isLoggedIn, uploader1.single('theStrokeOrder'), (req, res, next) => {

  FlashCard.create({
    kanji: req.body.theKanji,
    meaning: req.body.theMeaning,
    onyomi: req.body.theOnyomi,
    kunyomi: req.body.theKunyomi,
    strokes: req.body.theStrokes,
    grade: req.body.theGrade,
    link: req.body.theLink,
    strokeOrder: req.file ? req.file.path : null,
    createdBy: req.session.currentUser._id,
    createdByUser: true
  })
  .then((response) => {
    User.findByIdAndUpdate(req.session.currentUser._id, {
      $push: {flashCards: response}
    })
    .then(() => {
      res.redirect('/flashCards/add-audio/' + response._id);
    })
    .catch((error) => {
      req.flash('error', 'There was an error, please try again.');
      next(error);
    });
  })
  .catch((error) => {
    next(error);
  })
});



// Add audio get and post route
router.get('/add-audio/:id', isLoggedIn, (req, res, next) => {
  FlashCard.findById(req.params.id)
   .then((theCardAudio) => {
    res.render('flashCards/addAudio', { theCardAudio });
  })
 .catch((error) => {
     next(error);
 })
});

router.post('/add-audio/:theID',  isLoggedIn, uploader2.single('theAudio'), (req, res, next) => {
  let examples = [];
  const exampleTexts = req.body.theText;
  const exampleAudios = req.file ? req.file.path : null;

  for (let i = 0; i < exampleTexts.length; i++) {
    const example = {
      text: exampleTexts[i],
      audio: exampleAudios
    };
    examples.push(example);
  }

  FlashCard.findByIdAndUpdate(req.params.theID, {
    examples: examples
  })
  .then(() => {
     req.flash('success', 'Your FlashCard was created successfully');
     res.redirect('/flashCards/all');
     })
    .catch((error) => {
      next(error);
     })
    
});




// Update FlashCard GET and POST route

// router.get('/edit/:id', /* isLoggedIn */ (req, res, next) => {
//   FlashCard.findById(req.params.id)
//   .then((theCard) => {
//     res.render('flashCards/update-flashCard', { theCard });
//   })
//   .catch((error) => {
//     next(error);
//   })
// });

// router.post('/update/:theID', /* isLoggedIn */ uploader.fields([
//   {name: 'theAudio'},
//   {name: 'theStrokeOrder'}
// ]),  (req, res, next) => {
//   const { theAudio, theStrokeOrder } = req.files;

//   const exampleTexts = req.body.theText;
//   const exampleAudios = req.files.theAudio;

//   let examples = [];

//   for (let i = 0; i < exampleTexts.length; i++) {
//     const example = {
//       text: exampleTexts[i],
//       audio: exampleAudios && exampleAudios[i] ? exampleAudios[i].path : null
//     };
//     examples.push(example);
//   }
  

// FlashCard.findByIdAndUpdate(req.params.theID, {
//   kanji: req.body.theKanji,
//   meaning: req.body.theMeaning,
//   onyomi: req.body.theOnyomi,
//   kunyomi: req.body.theKunyomi,
//   strokes: req.body.theStrokes,
//   grade: req.body.theGrade,
//   examples: examples,
//   link: req.body.theLink,
//   strokeOrder: theStrokeOrder ? theStrokeOrder[0].path : null

// })
// .then(() => {
//   req.flash('success', 'Your FlashCard was updated successfully');
//   res.redirect('/flashCards/details/'+req.params.theID);
// })
// .catch((error) => {
//   next(error);
// })
// });



// Delete FlashCard POST route
router.post('/delete/:theID', isLoggedIn, (req, res, next) => {
  FlashCard.findByIdAndRemove(req.params.theID)
  .then(() => {
    req.flash('success', 'FlashCard was successfully deleted');
    res.redirect('/flashCards/all')
  })
  .catch((error) => {
    next(error);
  })
});

//Add KanjiAPI to My FlashCard 
router.post('/add-kanji', isLoggedIn, (req, res, next ) => {
  const kanjiData = req.body;
  console.log(kanjiData);
  const userID = req.session.currentUser._id;

  FlashCard.create({
    kanji: kanjiData.kanji,
    meaning: kanjiData.meaning,
    onyomi: kanjiData.onyomi,
    kunyomi: kanjiData.kunyomi,
    strokes: kanjiData.strokes,
    grade: kanjiData.grade,
    link: kanjiData.link,
    strokeOrder: kanjiData.strokeOrder,
    createdBy: userID,
    createdByUser: false
  })
  .then((newFlashCard) => {
    return User.findByIdAndUpdate(userID, {
      $push:{ flashCards: newFlashCard._id }
    });
  })
  .then(() => {
    req.flash('success', 'Kanji added to FlashCards successfully');
    res.redirect('/flashCards/all');
  })
  .catch((error) => {
    next(error);
  })
})





module.exports = router;

