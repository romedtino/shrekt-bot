var filter = require('./channel_filter.js')

var cmd = "royale";

var winn

function help_info() {
  var help = {};
  help["command"] = cmd;
  help["help"] = "List people who have won a solo game on Fortnite. Usage `!royale`";

  return help;
 
}

function execute(command, args, message) {
  
  if(command === cmd && filter(message)) {
    message.channel.send("");
  }


}

module.exports.execute = execute;
module.exports.help_info = help_info;
