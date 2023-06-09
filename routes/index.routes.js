const express = require('express');
const router = express.Router();

const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');


// HOME PAGE Route to display search bar and result
router.get('/', async (req, res, next) => {
  try {
  const options = {
    method: 'GET',
    url: 'https://kanjialive-api.p.rapidapi.com/api/public/search/',
    headers: {
      'X-RapidAPI-Key': process.env.APIKEY,
      'X-RapidAPI-Host': 'kanjialive-api.p.rapidapi.com'
    }
  };

  const { q } = req.query;

  if (q) {
    options.url += encodeURIComponent(q);
    const response = await axios.request(options);
    const result = response.data;
    res.render('index', { result });
  } else {
    res.render('index');
  }   
  } catch (error) {
    next(error)
  }
  
});

// Kanji Details Route
router.get('/:character/details', async (req, res, next) => {
  try {
    const options = {
      method: 'GET',
      url: `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${req.params.character}`,
      headers: {
        'X-RapidAPI-Key': process.env.APIKEY,
        'X-RapidAPI-Host': 'kanjialive-api.p.rapidapi.com'
      }
    }

    const response = await axios.request(options);
    const resultDetails = response.data;

   //Access examples and loop through it
    const examples = resultDetails.examples;

    examples.forEach((example) => {
      const japanese = example.japanese;
      const meaning = example.meaning.english;
      const audioMp3 = example.audio.mp3;
    });
    //-----------

    res.render('kanjiAPI/details-kanji', { resultDetails, examples });
  }catch (error) {
      next(error);
    }


});











module.exports = router;
