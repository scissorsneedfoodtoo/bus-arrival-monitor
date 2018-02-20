const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch();
  const kyungdaeAptCorner = await browser.newPage();
  // const kyungdaeAptFront = await browser.newPage();
  await kyungdaeAptCorner.goto('http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010100&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%B0%C7%B3%CA');
  // await kyungdaeAptFront.goto('http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010200&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%BE%D5');

  // const kyungdaeAptFrontBusData = [];

  const kyungdaeAptCornerResult = await kyungdaeAptCorner.evaluate(() => {
    // const kyungdaeAptCornerStatus = document.querySelector('#ct > div.dp > div > h3').innerText;
    const busses = document.querySelectorAll('#ct > div.dp > ul li');
    let kyungdaeAptCornerBusData = {
      busStopNameAndStatus: document.querySelector('#ct > div.dp > div > h3').innerText,
      busses: []
    };

    // kyungdaeAptCornerBusData.busStopNameAndStatus = kyungdaeAptCornerStatus;

    for (let bus of busses) {
      // kyungdaeAptCornerBusData.busses.push(bus.outerHTML);

      let currBus = {
        routeNo: bus.childNodes[0].textContent,
        arrState: bus.childNodes[1].textContent,
        currPos: bus.childNodes[2].textContent,
        urgent: bus.outerHTML.match(/class="st"/) ? true : false // check the outerHTML string for a unique class for a nearby bus and style red later
      }

      kyungdaeAptCornerBusData.busses.push(currBus);

    }

    return kyungdaeAptCornerBusData;
  })

  browser.close();
  return kyungdaeAptCornerResult;
}

scrape().then((value) => {
  console.log(value);
});
