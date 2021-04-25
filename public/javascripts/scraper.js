const puppeteer = require('puppeteer');
const randomUA = require('./randomUA.js');
const busStopURLs = [
  'https://businfo.daegu.go.kr:8095/dbms_web/map?searchText=%EB%B2%95%EC%9B%90%EC%95%9E&wincId=09089', // in front of court
  'https://businfo.daegu.go.kr:8095/dbms_web/map?searchText=%EA%B7%B8%EB%9E%9C%EB%93%9C%ED%98%B8%ED%85%94%EC%95%9E&wincId=02016' // in front of grand hotel
];
let busArrivalInfo = [];

async function scrapeBusStop(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent(randomUA());
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  try {
    const busStopObj = await page.evaluate(() => {
      const scrapedBusses = Array.from(document.querySelectorAll("[id^='selectRoute'] .list-group-item")).filter((__, i) => i < 6);

      return {
        busStopNameAndStatus: document.querySelector('#selectBS0 > a > div.form-inline > h6').innerText,
        busses: scrapedBusses.map(bus => {
          const urgentClass = bus.querySelector('li:nth-child(1) > div:nth-child(3) > span').classList[0];
    
          return {
            routeNo: bus.getElementsByClassName('mb-0')[0].innerText,
            arrState: bus.getElementsByClassName('arrMin')[0].innerText,
            currPos: bus.querySelector('div.marquee-parent > div > div').innerText,
            urgent: urgentClass === 'text-danger' || urgentClass === 'text-danger2' ? true : false
          }
        })
      };
    });

    busArrivalInfo.push(busStopObj);
  } catch(err) {
    console.error(err);
  } finally {
    browser.close();
  }
}

function compareBusStopNames(a, __) {
  if (a.busStopNameAndStatus.includes('그랜드호텔앞')) { // show grand hotel first
    return 0;
  } else {
    return 1;
  }
}

async function startScraper() {
  return await Promise.all(busStopURLs.map((url) => {
    return scrapeBusStop(url);
  })).catch(err => {
    console.error(err);
  });
}

function returnJSON() {
  // clear busArrivalInfo if this is not the first time the program is running
  busArrivalInfo = [];

  return startScraper().then(() => {
    const orderedBusArrivalInfo = busArrivalInfo.sort(compareBusStopNames);

    // Do stuff here!
    return JSON.stringify(orderedBusArrivalInfo);
  });
}

module.exports = {
  fetchBusStopData: returnJSON
}
