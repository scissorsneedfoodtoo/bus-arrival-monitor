const puppeteer = require('puppeteer');
const busStopURLs = [
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010100&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%B0%C7%B3%CA', // kyungdaeAptCorner
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010200&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%BE%D5' //kyungdaeAptFront
]
const busArrivalInfo = [];

async function scrape(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const results = await page.evaluate(() => {
    const busses = document.querySelectorAll('#ct > div.dp > ul li');

    let busStopObj = {
      busStopNameAndStatus: document.querySelector('#ct > div.dp > div > h3').innerText,
      busses: []
    };

    for (let bus of busses) {
      let currBus = {
        routeNo: bus.childNodes[0].textContent,
        arrState: bus.childNodes[1].textContent,
        currPos: bus.childNodes[2].textContent,
        urgent: bus.outerHTML.match(/class="st"/) ? true : false // check the outerHTML string for a unique class for a nearby bus and style red later
      };

      busStopObj.busses.push(currBus);
    }

    return busStopObj;
  });

  await page.close();
  await browser.close();

  return busArrivalInfo.push(results);
}

// consider using an npm package(https://github.com/caolan/async) to make this more verbose
async function run() {
  await Promise.all(busStopURLs.map((url) => {
    return scrape(url);
  }));
}

run().then(() => {
  console.log(busArrivalInfo);
});
