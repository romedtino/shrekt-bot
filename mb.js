var filter = require('./channel_filter.js')

var jsCommand = "mb"

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Look up or assign someone's Myer Brigg's personality type. Usage: `!" + jsCommand + " [@username][add @username]`"

  return help;

}

function fart(command, args, message) {
  if(command === jsCommand && filter(message)) {
    message.channel.send("<@" + message.author.id + "> farts on " + args + " with a soft soggy wet one");
  }

}

module.exports = fart;
module.exports.help_info = help_info;