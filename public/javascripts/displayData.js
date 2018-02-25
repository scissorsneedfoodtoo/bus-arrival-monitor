fetch('/data/busStopData.json')
  .then((res) => res.json())
  .then((busStopData) => {
    let busStopName = document.getElementsByClassName('bus-stop-name')[0];
    let display = document.getElementsByClassName('display')[0];
    const bussesArr = busStopData[0].busses;

    console.log(busStopData)
    busStopName.textContent = busStopData[0].busStopNameAndStatus;
    display.textContent = busStopData[0].busses[0].routeNo;
    display.textContent += ' | ' + busStopData[0].busses[0].arrState;
    display.textContent += ' | ' + busStopData[0].busses[0].currPos;


  }) // end fetch / then

  // busStopName.textContent = '<p>fuck</p>'
