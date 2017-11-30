// Incorporate modules
var request = require('request');

var keys = require('./keys.js'); // Contains keys for Twitter and Spotify
var Twitter = require('twitter');

var Spotify = require('node-spotify-api');
// ---------------------------------------


// The user's raw input
const rawInput = process.argv;
// ---------------------------------------


// Function to parse user input
function parse() {
  var parsedInputArray = [];
  for (var i = 3; i < rawInput.length; i++) {
    parsedInputArray.push(rawInput[i]);
  }

  return parsedInputArray.join(' ');

}
//-----------------------------------------


// Function to make Twitter API call and display results
function twitterAPI() {

  var client = new Twitter(keys.twitterKeys);

  var params = {
    screen_name: 'schapm16',
    count: '20'
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var time = tweets[i].created_at;
        var text = tweets[i].text;
        console.log('Posted At: ' + time + '    ' + 'Post Content: ' + text);
      }
    }
    else {
      console.log('Error Occured:\n' + error);
    }
  });
}
//-------------------------------------------


// Function to make Spotify API call and display song information

function spotifyAPI(parsedInput) {

  if (!parsedInput.length) {
    parsedInput = '"The sign"';
  }
  else {
    parsedInput = '"' + parsedInput + '"'; // Add double quotes per spotify API to search by keywords in the specific order entered by user
  }

  var spotify = new Spotify(keys.spotifyKeys);

  spotify.search({ type: 'track', query: parsedInput, market: "from_token", limit: "1" }, function(err, data) {
    if (err) {
      return console.log('Error occurred:\n' + err);
    }
    else {
      var dataShort = data.tracks.items[0]; //Variable to store common path into JSON response
      console.log('Top Result for: ' + parsedInput + '\n');
      console.log(
        'Artist: ' + dataShort.artists[0].name +
        '\nSong Name: ' + dataShort.name +
        '\nPreview: ' + dataShort.preview_url +
        '\nAlbum: ' + dataShort.album.name

      );
    }
  });
}
//-------------------------------------------

// Function to make OMDB API call using Request npm package

function omdbAPI() {

}

//-------------------------------------------

// Determine which operation the user has requested and 
//call the appropriate function above to fulful request
var methodRequested = rawInput[2];

switch (methodRequested) {
  case "my-tweets":
    twitterAPI();
    break;

  case "spotify-this-song":
    spotifyAPI(parse());
    break;

  case 'movie-this':

    break;

  case 'do-what-it-says':

    break;
}
