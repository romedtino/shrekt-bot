const { Client, GatewayIntentBits, Partials } = require("discord.js");

const congo = require('./bot-conglomorate.js');
const commandList = require('./commands.js').commands;

const DEBUG = false;
const TARGET_GUILD = DEBUG
  ? [process.env.TEST_GUILD_ID]
  : [process.env.SHREKT_GUILD_ID, process.env.JPL_GUILD_ID];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const config = require("./config.js");

client.once("ready", (c) => {
  console.log(`Bot has started, with ${c.users.cache.size} users, in ${c.channels.cache.size} channels of ${c.guilds.cache.size} guilds.`);
  c.user.setActivity(`${c.guilds.cache.size} swamps managed`);

  const commandNames = commandList.map((ele) => ele.command);
  load_slash_congos(commandNames);

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    for (const cmd of commandList) {
      if (cmd.command === interaction.commandName) {
        await congo.execute(cmd.command, cmd.args, client, interaction);
        break;
      }
    }
  });
});

function add_slash_command(command, guild) {
  return new Promise((resolve, reject) => {
    congo
      .get_slash(command)
      .then((res) => {
        console.log(`Added ${command}!`);
        client.api.applications(client.user.id).guilds(guild).commands.post({ data: res })
          .then(() => resolve("yes"))
          .catch((err) => {
            console.error(`Failed to register ${command}:`, err);
            reject(command);
          });
      })
      .catch((err) => {
        console.log("Problem receiving help from bot-congo: " + err);
        reject(command);
      });
  });
}

function load_slash_congos(congoList) {
  const promises = [];

  for (const guildId of TARGET_GUILD) {
    for (const cmd of congoList) {
      promises.push(add_slash_command(cmd, guildId));
    }
  }

  Promise.allSettled(promises).then((results) => {
    console.log("All promises received, checking for failures to redo...");
    const redos = [];
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value !== "yes") {
        console.log(`Redoing ${result.value}...`);
        redos.push(result.value);
      } else if (result.status === 'rejected') {
        // Already handled in add_slash_command
      }
    });

    // Fallback: re-check with results that failed
    const failedNames = results
      .filter(r => r.status === 'fulfilled' && r.value !== "yes")
      .map(r => r.value);

    if (failedNames.length !== 0) {
      setTimeout(() => { load_slash_congos(failedNames) }, 60000);
    } else {
      console.log("No redos. Nice.");
    }
  });
}

client.login(config.token)
  .catch(console.error);

client.on("error", (error) => console.error("Discord client error:", error));

module.exports = client;
