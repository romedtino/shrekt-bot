
var command_list = {};

function add_command(help) {
  command_list[help.command] = help.help; 

}

function execute(command, args, message) {
  
  if(command === "help") {  
    var msg = "*Hi. I'm a Banana.* No pajama. Make me do naughty things, if you wanna. \n\n";
    for(var cmd in command_list) {
      msg += "\t**" + cmd + "**\t\t- " + command_list[cmd] + "\n";
    }

    message.channel.send(msg);
  }
}


module.exports.execute = execute;
module.exports.add_command = add_command;
