const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const randomUA = require('./randomUA.js');
const busStopURLs = [
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7061005000&bsNm=%B9%FD%BF%F8%BE%D5', // in front of court
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7061003600&bsNm=%B1%D7%B7%A3%B5%E5%C8%A3%C5%DA%BE%D5' // in front of grand hotel
];
let busArrivalInfo = [];

async function scrapeBusStop(url) {
  const html = await fetch(url, {
    headers: {
      'User-Agent': randomUA()
    }
  })
    .then(res => res.textConverted())
    .then(body => body);
  const dom = new JSDOM(html);
  const window = dom.window;
  let busStopObj = {
    busStopNameAndStatus: window.document.querySelector('#ct > div.dp > div > h3').textContent,
    busses: []
  };
  try {
    const scrapedBusses = window.document.querySelectorAll('#ct > div.dp > ul li');
    let bussesRunning = window.document.querySelector('#ct > div.dp > ul > li > span').innerText;
    bussesRunning = bussesRunning !== '버스운행시간이 아닙니다.' && bussesRunning !== '현 정류소에서 10정류소 이내에 있는 버스의 노선만 조회됩니다.';

    if (bussesRunning) {
      // loop through the busses NodeList and create an object for each bus
      for (let bus of scrapedBusses) {
        let currBus = {
          routeNo: bus.getElementsByClassName('marquee')[0].textContent,
          arrState: bus.getElementsByClassName('arr_state')[0].textContent,
          currPos: bus.getElementsByClassName('cur_pos')[0].textContent,
          urgent: bus.classList[0] === 'st' ? true : false // check the outerHTML string for a unique class for a nearby bus and style red later
        };

        // push the bus object to the busses array of busStopObj
        busStopObj.busses.push(currBus);
      } // end for bus of busses
    } // end if bussesRunning
  } finally {
    busArrivalInfo.push(busStopObj);
  } // end try / finally
}

function compareBusStopNames(a, b) {
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
