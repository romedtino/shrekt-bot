var filter = require('./channel_filter.js')
var imgur = require('imgur');

var jsCommand = "brazzers";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Put the Brazzers logo on an image. Usage: `!brazzers [URL to image]`"

  return help;

}

function execute(command, args, message) {
  if(command === jsCommand && filter(message)) {
    request({
            url: cat,
            json: true
        }, function (error, response, body) {
            if(body.file === undefined )
            {
              message.channel.send("<@" + message.author.id +"> Sorry the meow API is overloaded... try again later.");
            }
            else {
              message.channel.send("<@" + message.author.id + "> meow! " + body.file);
              message.delete()
                .then(() => console.log("message deleted."))
                .catch(console.error);
            }
    });
  }

}

module.exports.execute = execute;
module.exports.help_info = help_info;
