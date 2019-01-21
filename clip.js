var request = require('request');
var filter = require('./channel_filter.js')

var twitchAPI = 'https://api.twitch.tv/helix';
var latestClipURL = "";
var latestClipMilli = null;
var mainUser = 'broadcaster_id=';
var clipCount = '&first=100';

function help_info() {
  var help = {};
  help["command"] = null;
  help["help"] = "";

  return help;
 
}

var twitchClipsRequest = function(message, login, extraParams)
{
  var options = { url:twitchAPI + '/clips?' + mainUser + clipCount + extraParams,
                  json: true,
                  headers: {
                    "Client-ID" : process.env.TWITCH_TOKEN
                  }
                };
  
    request(options, function(error, response, body) {
      
      for(var i=0;i< body.data.length;i++) {
        var milli = Date.parse(body.data[i].created_at);
        if(latestClipMilli == null || latestClipMilli < milli) {
          latestClipMilli = milli;
          latestClipURL = body.data[i].url;
        }
      }
      
      if(body.pagination.cursor != null)
      {
        var paginator = "&after=" + body.pagination.cursor;
        twitchClipsRequest(message, login, paginator);
      } else {
        message.channel.send("<@" + message.author.id + "> here is " + login + "'s latest clip: " + latestClipURL);
        console.log("Found it: " + latestClipURL);
      }
      
    }  
  );
  
}

var getIdAndClip = function(message, login)
{
   var options = { url:twitchAPI + '/users?login=' + login,
                  json: true,
                  headers: {
                    "Client-ID" : process.env.TWITCH_TOKEN
                  }
                };
  request(options, function(error, response, body) {
    
    var bcastId = body.data[0].id;
    console.log(bcastId);
    twitchClipsRequest(message, bcastId);
  });
  
}

function execute(command, args, message) 
{
  if(command === "saj" && filter(message)) {
     getIdAndClip(message, args[0]);
  }
}

module.exports.execute = execute;
module.exports.help_info = help_info;