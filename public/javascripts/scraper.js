const puppeteer = require('puppeteer');
const fs = require('file-system');

const busStopURLs = [
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010100&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%B0%C7%B3%CA', // kyungdaeAptCorner
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010200&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%BE%D5' //kyungdaeAptFront
]
let busArrivalInfo = [];

async function scrape(url) {

  const browser = await puppeteer.launch({
    // executablePath: '/usr/bin/chromium-browser', // uncomment for Raspberry Pi --> https://github.com/GoogleChrome/puppeteer/issues/550
    headless: true, // these following args might not be necessary
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);

  const constructBusStopObj = await page.evaluate(() => {
    // fetches a NodeList of busses that are scheduled to arrive
    const busses = document.querySelectorAll('#ct > div.dp > ul li');
    // const noBussesCheck = document.querySelector('#ct > div.dp > ul > li > span') === '버스운행시간이 아닙니다.';
    const bussesRunning = busses[0].textContent !== '버스운행시간이 아닙니다.';

    let busStopObj = {
      busStopNameAndStatus: document.querySelector('#ct > div.dp > div > h3').innerText,
      busses: []
    };

    if (bussesRunning) {
      // loop through the busses NodeList and create an object for each bus
      for (let bus of busses) {
        let currBus = {
          routeNo: bus.childNodes[0].textContent,
          arrState: bus.childNodes[1].textContent,
          currPos: bus.childNodes[2].textContent,
          urgent: bus.outerHTML.match(/class="st"/) ? true : false // check the outerHTML string for a unique class for a nearby bus and style red later
        };

        // push the bus object to the busses array of busStopObj
        busStopObj.busses.push(currBus);
      } // end for bus of busses
    }

    return busStopObj;
  }); // end constructBusStopObj

  await page.close();
  await browser.close();

  busArrivalInfo.push(constructBusStopObj);
}

function compareBusStopNames(a, b) {
  if (a.busStopNameAndStatus.indexOf('경대아파트건너') > 0) {
    return 1;
  } else {
    return 0;
  }
}

async function runAsync() {
  // clear busArrivalInfo if this is not the first time the program is running
  busArrivalInfo = [];

  await Promise.all(busStopURLs.map((url) => {
    return scrape(url);
  }));
}

const executeAndSetTimeout = () => {
  runAsync().then(() => {
    const orderedBusArrivalInfo = busArrivalInfo.sort(compareBusStopNames);

    // Do stuff here!
    console.log(orderedBusArrivalInfo);
    // return orderedBusArrivalInfo;
    return fs.writeFile('public/data/busStopData.json', JSON.stringify(orderedBusArrivalInfo), (err) => {
      if (err) throw err;
    });
  });

  return setTimeout(executeAndSetTimeout, 20 * 1000);
}

module.exports = {
  beginScraping: executeAndSetTimeout
}
