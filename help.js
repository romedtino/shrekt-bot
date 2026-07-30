const command_list = {};

function help_info() {
  return {
    command: "help",
    help: "This help: Usage `!help`."
  };
}

function add_command(help) {
  if (help.command == null || help.command === "") return;
  command_list[help.command] = help.help;
}

function execute(command, args, message) {
  if (command !== "help") return;

  let msg = "*Hi. I'm a Banana.* No pajama. Make me do naughty things, if you wanna. \n\n";
  for (const cmd of Object.keys(command_list)) {
    msg += `**${cmd}**\n - ${command_list[cmd]}\n`;
  }

  message.channel.send(msg);
}

module.exports.execute = execute;
module.exports.add_command = add_command;
module.exports.help_info = help_info;
