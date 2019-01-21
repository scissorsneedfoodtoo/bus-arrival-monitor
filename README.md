# bus-arrival-monitor
<div align="center">
  <img width="400" height="300" src="https://github.com/scissorsneedfoodtoo/bus-arrival-monitor/blob/update-readme/docs/images/bus-arrival-monitor.jpg">
</div>

An Express app designed to run on a Raspberry Pi that scrapes bus data for Daegu, South Korea, serves it as an API, and displays the arrival times on a website through a mini HDMI display.

### Running the app

To use the app, clone this repository by entering `git clone https://github.com/scissorsneedfoodtoo/bus-arrival-monitor.git` into your terminal/command prompt/bash shell. Then, enter `cd bus-arrival-monitor` to change directories to the newly created bus-arrival-monitor directory. Finally, run `npm install` to install the necessary dependencies and `npm start` to start the app and automatically open the website.

### Changing which bus stops to monitor
Go to [this website](http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfoMain) and enter the bus stop number you want to display arrival times for. There are usually stickers displaying the bus stop number on or around the bus stop itself. Then, add the URL of the bus stop you want to track to the [busStopURLs](https://github.com/scissorsneedfoodtoo/bus-arrival-monitor/blob/ac960e006ba3a957d4e25039e191b41b950217cd/public/javascripts/scraper.js#L3) array in [public/javascripts/sraper.js](https://github.com/scissorsneedfoodtoo/bus-arrival-monitor/blob/master/public/javascripts/scraper.js) as a string. Multiple bus stops can be tracked so long as their URL strings are separated by a comma:

```js
const busStopURLs = [
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010100&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%B0%C7%B3%CA', // kyungdaeAptCorner
  'http://m.businfo.go.kr/bp/m/realTime.do?act=arrInfo&bsId=7011010200&bsNm=%B0%E6%B4%EB%BE%C6%C6%C4%C6%AE%BE%D5' //kyungdaeAptFront
];
```

Data from each bus stop in the array will be scraped every `10 * busStopURLs.length` seconds and displayed on the website for 10 seconds. Using the array above as an example, bus arrival data is scraped every 20 seconds, and the data for each stop is displayed for 10 seconds.

### Possible issues
This was meant to run on a Raspberry Pi running Raspbian where Chromium is installed by default. If you experience an error running the app after using the following commands, try updating or (re)installing Chromium and try `npm start` again.

Also, due to Puppeteer requiring a relatively new version of Chromium, there were some issues with the latest version in the Raspbian repository. This may or may not be a problem now, but if so, see [this page](https://github.com/GoogleChrome/puppeteer/issues/550) for more information about building a more recent version of Chromium and getting Puppeteer to run on a Raspberry Pi.

Finally, if you change the bus stops in the `busStopURLs` array there is a fair chance that the data will not be displayed in the order you want it to be. This is due to the asynchronous nature of JavaScript and follows best practices of preferring non-blocking code to blocking, synchronous code. Simply modify the [compareBusStopNames](https://github.com/scissorsneedfoodtoo/bus-arrival-monitor/blob/ac960e006ba3a957d4e25039e191b41b950217cd/public/javascripts/scraper.js#L54) function in [public/javascripts/sraper.js](https://github.com/scissorsneedfoodtoo/bus-arrival-monitor/blob/master/public/javascripts/scraper.js) to display the bus stops in the desired order.
