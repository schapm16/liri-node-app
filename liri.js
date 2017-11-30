// Incorporate modules
var request = require('request');

var twitterKeys = require('./keys.js');
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

  var client = new Twitter(twitterKeys);

  var params = {
    screen_name: 'schapm16',
    count: '20'
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var time = tweets[i].created_at;
        var text = tweets[i].text;
        console.log('Posted At: ' + time + '    ' + 'Post Content:' + text);
      }
    }
    else {
      console.log('Uh Oh! Something went wrong with your request for Tweets. \n\nError Details:\n' + error);
    }
  });
}
//-------------------------------------------


// Function to make Spotify API call and display song information

function spotifyAPI(parsedInput) {

  if (!parsedInput.length) {
    parsedInput = "The sign";
  }

  var spotify = new Spotify({
    id: 'fd74938b48d74a0ebfc13f7e69d6d7ea',
    secret: '9c4bdcd4dd4d42c59c23b22f80427497',
  });

  spotify.search({ type: 'track', query: parsedInput, market: "from_token", limit: "1" }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    else {
      // console.log(JSON.stringify(data, null, 2));
      console.log(data.tracks.items);
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
