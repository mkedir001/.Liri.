require("dotenv").config();


var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var request = require('request');
var fs = require('fs');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArgv = process.argv
var command = process.argv[2];
var command2 = process.argv[3];
input="";

for(var i =2; i< nodeArgv.length; i++){
    if (i>2 && i<nodeArgv.length) {
        input = input + "+" + nodeArgv[i];
    }
    else {
        input += nodeArgv[i];
    }
}
console.log(input);

function getTweet(){
    client.get('favorites/list', function(error, tweets, response){
        if(error) throw error;

        for(var i = 0; i< tweets.length; i++){
            var timestamp = tweets[i].created_at;
            var username = tweets[i].user.screen_name;
            var context = tweets[i].text;
            console.log(username + ": " + context + " " + "tweeted on " + timestamp);
            console.log("------------------");
            
        }
// console.log(tweets);
    });
};
switch (command) {
    case "my-tweets":
        getTweet();
        break;
    case "spotify-this":
        getSpotify(command2);
        break;
    case "my-movie":
        getMovie(command2);
        break;
    default:
        console.log("Command not found");
}

function getSpotify(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {
            var songs = data.tracks.items[i].album.artists[i].name;
            var album = data.tracks.items[i].album.name;
            var songdata = data.tracks.items[i].name;
            var link = data.tracks.items[i].uri;
            console.log(" SPOTIFY")
            console.log(" -----")
            console.log("Track Name:" + " " + songdata + " " + "Artist" + ": " + songs + " " + "Album Name" + ": " + link + " " + "Album Title" + " " + album);
            console.log("----------------------------------------")
        }
    })
};

function getMovie(command2){
request("http://www.omdbapi.com/?t=" + command2 + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
        
      var movieresponse = JSON.parse(body);
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
          console.log("Tittle: " + movieresponse.Title);
        console.log("Year: " + movieresponse.Year);
        console.log("Country: " + movieresponse.Country);
        console.log("IMDB Rating: " + movieresponse.imdbRating);
        console.log("Language: " + movieresponse.Language);
        console.log("Rotten Tomatoes Rating: " + movieresponse.Ratings[1].Value);
        console.log("Actors: " + movieresponse.Actors);
        console.log("Plot: " + movieresponse.Plot);
    }
});
}

function doIt(command2){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(!error){
            doItResults = data.split(",");
            command2 = doItResults[1];
            console.log(command2);
            getSpotify(command2);
        }
    })
}



