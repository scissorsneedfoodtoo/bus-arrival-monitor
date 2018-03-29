const puppeteer = require('puppeteer');

const busStopURLs = [
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7061017500&bsNm=%C8%B2%B1%DD%BF%EC%B9%E61%C2%F7%B0%C7%B3%CA' // 황금우방1차건너
];
let busArrivalInfo = [];

async function scrapeBusStop(url) {

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser', // uncomment for Raspberry Pi --> https://github.com/GoogleChrome/puppeteer/issues/550
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(url);

  const constructBusStopObj = await page.evaluate(() => {
    // fetches a NodeList of busses that are scheduled to arrive
    let busStopObj = {
      busStopNameAndStatus: document.querySelector('#ct > div.dp > div > h3').innerText,
      busses: []
    };
    const busses = document.querySelectorAll('#ct > div.dp > ul li');

    try {
      let bussesRunning = document.querySelector('#ct > div.dp > ul > li > span').innerText;
      bussesRunning = bussesRunning !== '버스운행시간이 아닙니다.' && bussesRunning !== '현 정류소에서 10정류소 이내에 있는 버스의 노선만 조회됩니다.';

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
      } // end if bussesRunning
    } finally {
      return busStopObj;
    } // end try / finally
  }); // end constructBusStopObj

  await busArrivalInfo.push(constructBusStopObj);

  await page.close();
  await browser.close();
}

function compareBusStopNames(a, b) {
  if (a.busStopNameAndStatus.indexOf('경대아파트건너') > -1) {
    return 0;
  } else {
    return 1;
  }
}

async function startScraper() {
  return await Promise.all(busStopURLs.map((url) => {
    return scrapeBusStop(url);
  }));
}

function returnJSON() {
  // clear busArrivalInfo if this is not the first time the program is running
  busArrivalInfo = [];

  return startScraper().then(() => {
    const orderedBusArrivalInfo = busArrivalInfo.sort(compareBusStopNames);

    // Do stuff here!
    // console.log(orderedBusArrivalInfo);
    return JSON.stringify(orderedBusArrivalInfo);
  });
}

module.exports = {
  fetchBusStopData: returnJSON
}
