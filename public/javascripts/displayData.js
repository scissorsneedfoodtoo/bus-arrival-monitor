fetch('/data/busStopData.json')
  .then((res) => res.json())
  .then((busStopData) => {
    const display = document.getElementsByClassName('display')[0];
    const bussesArr = busStopData[0].busses;
    const busStopHTMLs = [];

    // console.log(busStopData)

    // Construct HTML for each bus stop and push it to busStopHTMLs
    busStopData.forEach((busStop) => {
      let currBusStopHTML = "<h1 class='bus-stop-name'>" + busStop.busStopNameAndStatus + "</h1>";

      busStop.busses.forEach((bus) => {
        currBusStopHTML += "<p class='bus-info'>" + bus.routeNo;
        currBusStopHTML += ' | ' + bus.arrState;
        currBusStopHTML += ' | ' + bus.currPos + "</p>";
      });

      busStopHTMLs.push(currBusStopHTML);
    });

    // // Loop through the HTMLs in busStopHTMLs and display with a delay
    // busStopHTMLs.forEach(function(HTML, index) {
    //   setTimeout(function() {
    //     display.innerHTML = HTML;
    //   }, 10000 * index);
    // });

    console.log(busStopsHTML);

    display.innerHTML = busStopsHTML[0];


  }) // end fetch / then
