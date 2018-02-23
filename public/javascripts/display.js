// const busStopData = '/data/busStopData.json';

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
  .then((data) => {
    console.log(data);
  })

// console.log(busStopData);
