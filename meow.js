var filter = require('./channel_filter.js')
var request = require ("request");
var cat = "http://aws.random.cat/meow"

var jsCommand = "meow";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Get a random cat. Usage: `!meow`"

  return help;

}

function meow(command, message) {
  if(command === jsCommand && filter(message)) {
    request({
            url: cat,
            json: true
        }, function (error, response, body) {
            message.channel.send("<@" + message.author.id + "> meow! " + body.file);
            })
  }

}

module.exports = meow;
module.exports.help_info = help_info;
