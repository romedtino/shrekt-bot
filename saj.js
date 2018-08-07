var filter = require('./channel_filter.js')
var request = require ("request");
var uri = "https://api.twitch.tv/helix/clips?broadcaster_id=30635747"

var jsCommand = "sajlate";
var latestTime = "";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "TBD"

  return help;

}

function execute(command, args, message) {
  if(command === jsCommand && filter(message)) {
    request({
            url: uri,
            headers : {
              'Client-ID' : process.env.TWITCH_TOKEN
            }
        }, function (error, response, body) {
            var parsed = JSON.parse(body);
            
    })
  }

}

module.exports.execute = execute;
module.exports.help_info = help_info;