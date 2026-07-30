const filter = require('./channel_filter.js');

function help_info() {
  return {
    command: "poll",
    help: "Start a poll. Usage: `!poll [Poll Question],[Option 1 emoji],[Option 1 text],[Option 2 emoji],[Option 2 text],...[Option N emoji],[Option N text]`\n    e.g. `!poll Who is the best at making breakfast?, :laughing: , John Adams, :rofl:, Benjamin Button`"
  };
}

function execute(command, args, message) {
  if (command !== "poll" || !filter(message)) return;

  const channelName = "polls";
  let pollText = "";
  const pollInfo = args.join(" ").split(',');

  if (pollInfo.length % 2 === 0) {
    message.channel.send("Bad poll format. Please type `!help` to know how to properly create a poll");
    return;
  }

  pollText += pollInfo[0] + "\n";
  console.log("Poll Question: " + pollInfo[0]);

  // i=1 -- exclude poll question
  for (let i = 1; i < pollInfo.length - 1; i += 2) {
    pollText += pollInfo[i] + " - " + pollInfo[i + 1] + "\n";
  }

  const pollChannel = message.guild.channels.cache.find(ch => ch.name === channelName);

  if (!pollChannel) {
    message.channel.send("The Guild (server) you're on doesn't seem to have a polls channel.");
    return;
  }

  pollChannel.send(`<@${message.author.id}> ${pollText}`)
    .then((pollMessage) => {
      const promisedReactions = [];

      for (let i = 1; i < pollInfo.length - 1; i += 2) {
        const rawEmoji = pollInfo[i].trim();

        if (rawEmoji.includes(":")) {
          // Custom emoji — extract the emoji ID from <:name:id>
          const emojiId = rawEmoji.slice(rawEmoji.lastIndexOf(":") + 1, -1);
          const tgtEmoji = pollMessage.client.emojis.cache.get(emojiId);
          if (tgtEmoji) {
            promisedReactions.push(pollMessage.react(tgtEmoji));
          } else {
            console.warn(`Custom emoji not found: ${emojiId}`);
          }
        } else {
          // Standard emoji
          promisedReactions.push(pollMessage.react(rawEmoji));
        }
      }

      Promise.all(promisedReactions).then(() => {
        message.delete()
          .then(() => console.log("message deleted."))
          .catch(console.error);
      });
    })
    .catch(() => {
      message.channel.send("Something went wonky with creating your poll :(");
    });
}

module.exports.execute = execute;
module.exports.help_info = help_info;
