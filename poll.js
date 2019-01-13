var filter = require('./channel_filter.js')

function help_info() {
  var help = {};
  help["command"] = "poll";
  help["help"] = "Start a poll. Usage: !poll [Poll Question][Option 1 emoji][Option 1 text][Option 2 emoji][Option 2 text]...[Option N emoji][Option N text]";

  return help;
 
}

function execute(command, args, message) {
  
  if(command === "poll" && filter(message)) {
    
    message.channel.send("<@" + message.author.id + "> slaps " + args + " around a bit with a large trout");
  }


}

module.exports.execute = execute;
module.exports.help_info = help_info;
