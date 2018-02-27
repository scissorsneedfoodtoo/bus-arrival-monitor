function displayBusData() {
  fetch('/data/busStopData.json')
  .then((res) => res.json())
  .then((busStopData) => {
    const display = document.getElementsByClassName('display')[0];
    const bussesArr = busStopData[0].busses;
    const busStopHTMLs = [];
    let finished = null;

    console.log(busStopData)

    // Construct HTML for each bus stop and push it to busStopHTMLs
    busStopData.forEach((busStop) => {
      let currBusStopHTML = "<h1 class='bus-stop-name'>" + busStop.busStopNameAndStatus + "</h1>";
      currBusStopHTML += "<div class='all-busses'>";

      busStop.busses.forEach((bus) => {
        currBusStopHTML += "<div class='bus-info'>";
        currBusStopHTML += "<div class='route-no'>" + bus.routeNo + "</div>";
        currBusStopHTML += "<div class='arr-state'>" + bus.arrState + "</div>";
        currBusStopHTML += "<div class='curr-pos'>" + bus.currPos + "</div></div>";
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

    return setTimeout(displayBusData, 10000 * busStopHTMLs.length);
  }); // end fetch / then
}

displayBusData();
