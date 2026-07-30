const { Client, GatewayIntentBits, Partials, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

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
const rest = new REST({ version: "10" }).setToken(config.token);

client.once("ready", (c) => {
  console.log(`Bot has started, with ${c.users.cache.size} users, in ${c.channels.cache.size} channels of ${c.guilds.cache.size} guilds.`);
  c.user.setActivity(`${c.guilds.cache.size} swamps managed`);

  const commandNames = commandList.map((ele) => ele.command);
  load_slash_congos(c, commandNames);

  c.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    for (const cmd of commandList) {
      if (cmd.command === interaction.commandName) {
        await congo.execute(cmd.command, cmd.args, c, interaction);
        break;
      }
    }
  });
});

function add_slash_command(client, command, guild) {
  return new Promise((resolve, reject) => {
    congo
      .get_slash(command)
      .then((res) => {
        console.log(`Added ${command}!`);
        rest.put(Routes.applicationGuildCommands(client.user.id, guild), { body: [res] })
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

function load_slash_congos(client, congoList) {
  const promises = [];

  for (const guildId of TARGET_GUILD) {
    for (const cmd of congoList) {
      promises.push(add_slash_command(client, cmd, guildId));
    }
  }

  Promise.allSettled(promises).then((results) => {
    console.log("All promises received, checking for failures to redo...");
    const failedNames = results
      .filter(r => {
        if (r.status === 'fulfilled' && r.value !== "yes") {
          console.log(`Redoing ${r.value}...`);
          return true;
        }
        if (r.status === 'rejected') {
          console.log(`Redoing rejected registration (${r.reason})...`);
          return true;
        }
        return false;
      })
      .map(r => r.status === 'fulfilled' ? r.value : r.reason);

    if (failedNames.length !== 0) {
      setTimeout(() => { load_slash_congos(client, failedNames) }, 60000);
    } else {
      console.log("No redos. Nice.");
    }
  });
}

client.login(config.token)
  .catch(console.error);

client.on("error", (error) => console.error("Discord client error:", error));

module.exports = client;
