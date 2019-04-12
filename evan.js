var filter = require('./channel_filter.js')

let cmd = "evan";

function help_info() {
  var help = {};
  help["command"] = cmd;
  help["help"] = "Usage: `!evan `"

  return help;

}

function execute(command, args, message) {
  if(command === cmd && filter(message)) {
    message.delete()
      .then(() => console.log(`message poof`))
      .catch(console.error);
  }

}

module.exports.execute = execute;
module.exports.help_info = help_info;
