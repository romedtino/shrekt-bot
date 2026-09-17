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

function register_guild_commands(client, guild, congoList) {
  return Promise.allSettled(congoList.map((name) => congo.get_slash(name))).then((results) => {
    const defs = [];
    const failed = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        console.log(`Added ${congoList[i]}!`);
        defs.push(result.value);
      } else {
        console.log(`Problem receiving help from bot-congo for ${congoList[i]}: ` + result.reason);
        failed.push(congoList[i]);
      }
    });

    if (defs.length === 0) {
      throw new Error(`No slash definitions available for guild ${guild}`);
    }

    // PUT /guilds/{id}/commands is a BULK OVERWRITE: the body must contain
    // every command the guild should keep, or Discord deletes the rest.
    return rest
      .put(Routes.applicationGuildCommands(client.user.id, guild), { body: defs })
      .then(() => {
        console.log(`Registered ${defs.length}/${congoList.length} commands in guild ${guild}.`);
        return failed;
      });
  });
}

function load_slash_congos(client, congoList) {
  const promises = [];

  for (const guildId of TARGET_GUILD) {
    promises.push(register_guild_commands(client, guildId, congoList));
  }

  Promise.allSettled(promises).then((results) => {
    console.log("All promises received, checking for failures to redo...");
    const needsRedo = results.some(
      (r) => r.status === "rejected" || (Array.isArray(r.value) && r.value.length > 0)
    );

    if (needsRedo) {
      // Redo with the FULL list: the PUT is a bulk overwrite, so a partial
      // body would drop commands from the guild.
      setTimeout(() => { load_slash_congos(client, congoList) }, 60000);
    } else {
      console.log("No redos. Nice.");
    }
  });
}

client.login(config.token)
  .catch(console.error);

client.on("error", (error) => console.error("Discord client error:", error));

module.exports = client;
