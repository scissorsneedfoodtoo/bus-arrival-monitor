function displayBusData() {
  fetch('/data/busStopData.json')
  .then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }

    return res.json();
  })
  .then((busStopData) => {
    const display = document.getElementsByClassName('display')[0];
    const bussesArr = busStopData[0].busses;
    const busStopHTMLs = [];
    let finished = null;

    // console.log(busStopData)

    // Construct HTML for each bus stop and push it to busStopHTMLs
    busStopData.forEach((busStop) => {
      let currBusStopHTML = "<h1 class='bus-stop-name'>" + busStop.busStopNameAndStatus + "</h1>";
      currBusStopHTML += "<div class='all-busses'>";

      busStop.busses.forEach((bus) => {
        currBusStopHTML += "<div class='bus-info'>";
        currBusStopHTML += "<div class='route-no'>" + bus.routeNo + "</div>";
        currBusStopHTML += "<div class='arr-state'>" + styleArrState(bus.arrState) + "</div>";
        currBusStopHTML += "<div class='curr-pos'>" + styleCurrPos(bus.currPos) + "</div></div>";
      });

      currBusStopHTML += "</div>";
      busStopHTMLs.push(currBusStopHTML);
    });

    // Loop through the HTMLs in busStopHTMLs and display with a delay
    busStopHTMLs.forEach(function(HTML, index) {
      setTimeout(() => {
        display.innerHTML = HTML;
      }, 10000 * index);
    });

    // // For testing
    // console.log(busStopHTMLs);
    // display.innerHTML = busStopHTMLs[0];

    // return setTimeout(displayBusData, 10000 * busStopHTMLs.length);
    return refreshDisplay(10000 * busStopHTMLs.length);
  }).catch((error) => {
    // console.log(error);

    // run the program again after a brief delay
    // return setTimeout(displayBusData, 5000);
    return refreshDisplay(1000);
  }); // end fetch / then
}

let refreshTimer;

function refreshDisplay(delay) {
  clearTimeout(refreshTimer);

  return refreshTimer = setTimeout(displayBusData, delay);
}


function styleArrState(str) {
  const testArr = str.split('');
  let numStr = "";
  let charStr = "<div class='arr-state-chars'>";

  testArr.forEach((char) => {

    // check for characters that are numbers and style the following characters for the bus arrival time
    if (Number.isInteger(parseInt(char))) {
      numStr += char;
    } else {
      charStr += char;
    }
  });

  charStr += "</div>"
  numStr += charStr;

  return numStr;
}

function styleCurrPos(str) {
  const wordArr = str.split(' ');
  let finalStr = "";

  // console.log(testStr);
  wordArr.forEach((word) => {
    if (word === "출발") {
      finalStr += "<div class='departure'>" + word + "</div>";
    } else {
      finalStr += word;
    }
  });

  return finalStr;
}

displayBusData();
