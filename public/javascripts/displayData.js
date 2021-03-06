let busStopData;
let busStopHTMLs = [];
const display = document.getElementsByClassName('display')[0];

function displayBusData() {
  fetch('http://localhost:3000/bus-stop-data')
  .then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }

    return res.json();
  })
  .then((data) => {
    busStopData = data;

    // Construct HTML for each bus stop and push it to busStopHTMLs
    busStopData.forEach((busStop) => {
      let currBusStopHTML = "<h1 class='bus-stop-name'>" + busStop.busStopNameAndStatus + "</h1>";
      currBusStopHTML += "<div class='all-busses'>";

      busStop.busses.forEach((bus) => {
        currBusStopHTML += "<div class='bus-info'>";
        currBusStopHTML += "<div class='route-no'>" + bus.routeNo + "</div>";
        currBusStopHTML += "<div class='arr-state'>" + styleArrState(bus.arrState, bus.urgent) + "</div>";
        currBusStopHTML += "<div class='curr-pos'>" + styleCurrPos(bus.currPos) + "</div></div>";
      });

      currBusStopHTML += "</div>";
      busStopHTMLs.push(currBusStopHTML);
    });

    // Loop through the HTMLs in busStopHTMLs and display with a delay
    busStopHTMLs.forEach((HTML, index) => {
      setTimeout(() => {
        display.innerHTML = HTML;
      }, 10000 * index);
    });

    refreshBusData(10000 * busStopHTMLs.length);
  }).catch((error) => {
    console.error(error);
    refreshBusData(5000);
  }); // end fetch / then
} // end displayBusData

function refreshBusData(delay) {
  // clean up
  busStopData = null;
  busStopHTMLs = [];

  while (display.hasChildNodes()) {
    display.removeChild(display.lastChild);
  }

  setTimeout(displayBusData, delay);
}


function styleArrState(arrState, isUrgent) {
  const testArr = arrState.split('');
  let numStr = "";
  let charStr;
  isUrgent ? charStr = "<div class='arr-state-chars urgent'>" : charStr = "<div class='arr-state-chars'>";

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
} // end styleArrState

function styleCurrPos(str) {
  const wordArr = str.split(' ');
  let finalStr = "";

  wordArr.forEach((word) => {
    if (word === "출발") {
      finalStr += "<div class='departure'>" + word + "</div>";
    } else {
      finalStr += word;
    }
  });

  return finalStr;
} // end styleCurrPos

displayBusData();
