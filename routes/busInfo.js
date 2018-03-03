const express = require('express');
const router = express.Router();
const scraper = require('../public/javascripts/scraper.js');

/* GET bus-info */
router.get('/', (req, res) => {
  scraper.fetchBusStopData().then((busStopData) => {
    res.send(busStopData);
  });
});

module.exports = router;
