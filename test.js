const puppeteer = require('puppeteer');

async function getPic() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto('https://google.com');
  await page.screenshot({path: 'google.png'});

  await browser.close();
}

getPic();
