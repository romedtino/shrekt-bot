var filter = require('./channel_filter.js')
var request = require ("request");
var cat = "http://aws.random.cat/meow.php"

var jsCommand = "meow";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Get a random kirry. Usage: `!meow`"

  return help;

}

function meow(command, message) {
  if(command === jsCommand && filter(message)) {
    request({
            url: cat,
            json: true
        }, function (error, response, body) {
            console.log(body);
            message.channel.send("<@" + message.author.id + "> meow! " + body.file);
            })
  }

}

module.exports = meow;
module.exports.help_info = help_info;