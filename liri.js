// Incorporate modules
var request = require('request');

var keys = require('./keys.js'); // Contains keys for Twitter and Spotify
var Twitter = require('twitter');

var Spotify = require('node-spotify-api');
// ---------------------------------------


// The user's raw input
const rawInput = process.argv;
// ---------------------------------------

// >>>>>>>> Function Declarations Begin Here <<<<<<<<

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
  var spotify = new Spotify(keys.spotifyKeys);

  if (!parsedInput.length) { // Define a default search if the user does not enter a track title
    parsedInput = '"The sign"';
  }
  else {
    parsedInput = '"' + parsedInput + '"'; // Add double quotes per spotify API docs to search keywords in the specific order entered by user
  }

  spotify.search({ type: 'track', query: parsedInput, market: "from_token", limit: "1" }, function(error, data) {
    var dataShort = data.tracks.items[0]; // Stores common path into JSON response

    if (error) {
      console.log('Error occurred:\n' + error);
    } else if (data.tracks.total === 0) {
      console.log('No Song Found!\n');
    }
    else {
      console.log('Top Result for: ' + parsedInput + '\n');
      console.log(
        'Artist: ' + dataShort.artists[0].name +
        '\nSong Name: ' + dataShort.name +
        '\nPreview: ' + dataShort.preview_url +
        '\nAlbum: ' + dataShort.album.name + '\n'
      );
    }
  });
}
//-------------------------------------------

// Function to make OMDB API call using Request npm package

function omdbAPI(parsedInput) {
  if (!parsedInput) {
    parsedInput = "Mr. Nobody";
  }

  var url = 'https://www.omdbapi.com/?apikey=trilogy&type=movie&t=' + encodeURI(parsedInput);

  request(url, function(error, response, body) {
    var bodyParsed = JSON.parse(body); // The request npm callback argument 'body' is a string.  Needs JSON.parse().
    var rottenTomatoes = "There is no Rotten Tomatoes rating for this movie"; // Default message if rating does not exist.

    if (error) {
      console.log('Error Occurred:\n' + error);
    }
    else if (bodyParsed.Response === 'False') {
      console.log(bodyParsed.Error + '\n');
    }
    else {
      
      for (var i = 0; i<bodyParsed.Ratings.length; i++) { //Checks if a Rotten Tomatoes rating exists and replaces default message with rating.
        if (bodyParsed.Ratings[i].Source === 'Rotten Tomatoes') {
          rottenTomatoes = bodyParsed.Ratings[i].Value;
        }
      }
      
      console.log(
        'Movie Title: ' + bodyParsed.Title +
        '\nRelease Year: ' + bodyParsed.Year +
        '\nIMDB Rating: ' + bodyParsed.imdbRating +
        '\nRotten Tomatoes Rating: ' + rottenTomatoes + //See above for handling of rottenTomatoes
        '\nCountries: ' + bodyParsed.Country +
        '\nMovie Language: ' + bodyParsed.Language +
        '\nActors: ' + bodyParsed.Actors +
        '\nShort Plot: ' + bodyParsed.Plot + '\n'
      );
    }
  });
}

//-------------------------------------------

//>>>>>>>>> End Function Declarations <<<<<<<<


//>>>>>>>> Execution begins here after user input <<<<<<<<

// Determine which operation the user has requested and 
//call the appropriate function above to fulful request
var userRequest = rawInput[2];

switch (userRequest) {
  case 'my-tweets':
    twitterAPI();
    break;

  case 'spotify-this-song':
    spotifyAPI(parse());
    break;

  case 'movie-this':
    omdbAPI(parse());
    break;

  case 'do-what-it-says':
    break;

  default: //If an illegitimate command is entered, the following is displayed.
    console.log(
      'Unknown Command. Try one of the following:' +
      '\nmy-tweets' +
      '\nspotify-this-song <song title>' +
      '\nmovie-this <movie title>' +
      '\ndo-what-it-says\n'
    );
}
