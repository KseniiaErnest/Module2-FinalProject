const express = require('express');
const router = express.Router();

const axios = require('axios');


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
router.get('/:theID', async (req, res, next) => {
  try {
    const options = {
      method: 'GET',
      url: `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${req.params.theID}`,
      headers: {
        'X-RapidAPI-Key': process.env.APIKEY,
        'X-RapidAPI-Host': 'kanjialive-api.p.rapidapi.com'
      }
    }

    const response = await axios.request(options);
    const result = response.data;
  }catch (error) {
      next(error);
    }


})









module.exports = router;
