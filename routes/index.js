const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const fs = require('file-system');
const scraper = require('../public/javascripts/scraper.js');

scraper.beginScraping();

/* GET home page */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Bus Arrival Info Service' });
});

module.exports = router;
