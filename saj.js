var filter = require('./channel_filter.js')
var request = require ("request");
var uri = "https://api.twitch.tv/helix/clips?broadcaster_id=30635747"

var jsCommand = "sajlate";

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
            }
        }, function (error, response, body) {
            if(body.file === undefined )
            {
              message.channel.send("<@" + message.author.id +"> Sorry the meow API is overloaded... try again later.");
            }
            else {
              message.channel.send("<@" + message.author.id + "> meow! " + body.file);
            }
            })
  }

}

module.exports.execute = execute;
module.exports.help_info = help_info;