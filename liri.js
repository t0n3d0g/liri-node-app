// LIRI is a Language Interpretation and Recognition Interface.
// LIRI will be a command line node app
// that takes in parameters and gives you back data.

// These are required to run the program

require("dotenv").config();
const axios = require("axios");
const Spotify = require("node-spotify-api");
const moment = require("moment");

const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

// Inputs user command and info for Liri

var command = process.argv[2];
var info = process.argv.slice(3).join(" ");

// Switch was introduced by my tutor to simplify choosing between
// various functions including cases where a request has no attributes

switch(command){
    case "spotify-this-song":
    if(info){
    songSearch(info);
    } else {songSearch("Ace of Spades")}
    break;

    case "concert-this":
    if(info){
        concertSearch(info);
    } else {console.log ("Please select an Artist to search for their Concerts")}
    break;

    case "movie-this":
    if(info){
    movieSearch(info);
    } else {movieSearch("Mr. Nobody")}
    break;

    default:
    console.log("default state");
}

// Example: concert-this <artist/band name> returns
// Name of the venue, Venue location, Date of the Event
// (use moment to format this as "MM/DD/YYYY")

function concertSearch (band) {
    var concertQuery = "https://rest.bandsintown.com/artists/" + info + "/events?app_id=codingbootcamp";
   
    axios.get(concertQuery).then(function(res, err){
        res.data.forEach(function(concert){
            // Converting date
            var concertDate = concert.datetime.split("T");
            var momentDate = moment(concertDate[0]).format("MM/DD/YYYY");
        
            // Output to console.log
            console.log("--------------------------")
            console.log("VENUE: "+concert.venue.name);
            console.log("LOCATION: "+concert.venue.city);
            console.log("REGION: "+concert.venue.region);
            console.log("COUNTRY: "+concert.venue.country);
            console.log("DATE: "+momentDate);    });
    });            
   
    
} 

// Example: spotify-this-song '<song name here>' returns
// Artist(s), song name, preview link, album

function songSearch (title) {
    spotify.search({ type: 'track', query: title }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
    //  Output to console.log requested results for song
      console.log("ARTIST NAME: "+data.tracks.items[0].artists[0].name);
      console.log("TRACK NAME: "+data.tracks.items[0].name);
      console.log("PREVIEW URL: "+data.tracks.items[0].preview_url);
      console.log("ALBUM: "+data.tracks.items[0].album.name);
      });} 


// Example: movie-this '<movie name here>' returns
// Title, Year, IMDB Rating, Rotten Tomatoes Rating,
// Country, Language, Plot, Actors

function movieSearch (title) {

    var movieQuery = "http://www.omdbapi.com/?t="+title+"&y=&plot=short&apikey=trilogy";

    axios.get(movieQuery).then(function(res){
        // Output to console.log
        console.log("TITLE: "+res.data.Title);
        console.log("YEAR: "+res.data.Year);
        console.log("IMDB Rating: "+res.data.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: "+res.data.Ratings[1].Value);
        console.log("COUNTRY: "+res.data.Country);
        console.log("LANGUAGE: "+res.data.Language);
        console.log("PLOT: "+res.data.Plot);
        console.log("ACTORS: "+res.data.Actors);
    
    });
}


// Example: do-what-it-says
