const express = require('express');
const router = express.Router();
const scraper = require('../public/javascripts/scraper.js');

/* GET bus-info */
router.get('/', (req, res) => {
  scraper.beginScraping().then((busData) => {
    res.send(busData);
  });
});

module.exports = router;
