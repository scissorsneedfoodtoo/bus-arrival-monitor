// let busStopData = null;

// console.log(busStopData);

// fetch('/data/busStopData.json')
//   .then(
//     function(response) {
//       if (response.status !== 200) {
//         console.log('Looks like there was a problem. Status Code: ' +
//           response.status);
//         return;
//       }
//
//       // Examine the text in the response
//       response.json().then(function(data) {
//         console.log(data);
//       });
//     }
//   )
//   .catch(function(err) {
//     console.log('Fetch Error :-S', err);
//   });

fetch('/data/busStopData.json')
  .then((res) => res.json())
  .then((busStopData) => {
    console.log(busStopData);
  })
