const Discord = require("discord.js");

const url = process.env.CONGO_URL;

/**
 * Execute a conglomorate command via the external bot-congo service.
 * Uses Discord.js v14 interaction.reply() / interaction.editReply() patterns.
 */
async function execute(command, args, client, interaction) {
  if (!interaction || !interaction.deferred) {
    await interaction.deferReply();
  }

  let extraArgs = "";
  if (interaction.data?.options) {
    console.log("DEBUG:" + JSON.stringify(interaction.data.options));
    interaction.data.options.forEach((e) => {
      if (e.value !== undefined) {
        extraArgs += e.value + " ";
      }
    });
  }

  const payload = {
    client: interaction.member?.user?.id ?? interaction.user.id,
    username: interaction.member?.user?.username ?? interaction.user.username,
    key: process.env.SHREKT_KEY,
    args: args + extraArgs.trim(),
    raw_opt: interaction.data?.options ?? null,
  };

  const customUrl = url + command;

  try {
    console.log("Requesting from bot congo...");
    const response = await fetch(customUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await response.json();

    if (body.text === undefined) {
      // Webhook-style response (likely image/attachment)
      await interaction.editReply({
        content: null,
        files: [body.attachment],
      });
    } else {
      if (command === "chat") {
        console.log("WOW WEE");
        const embed = new Discord.EmbedBuilder()
          .setDescription(body.attachment);
        await interaction.editReply({
          content: body.text,
          embeds: [embed],
        });
      } else {
        console.log("Hm not quit");
        await interaction.editReply({
          content: body.text,
          files: [body.attachment],
        });
      }
    }
  } catch (error) {
    console.error("Error calling congo service:", error);
    await interaction.editReply({
      content: "Something went wrong while processing your command. :(",
    }).catch(() => {
      // Interaction may have expired; try webhook fallback
      try {
        new Discord.WebhookClient({
          url: `https://discord.com/api/webhooks/${client.user.id}/${interaction.token}`,
        }).send("Something went wrong while processing your command. :(");
      } catch (webhookErr) {
        console.error("Webhook fallback also failed:", webhookErr);
      }
    });
  }
}

/**
 * Fetch slash command definition from the congo service.
 */
function get_slash(command) {
  return new Promise((resolve, reject) => {
    const customUrl = url + command + "/get_slash";
    console.log("[CONGO] - Grabbing slash: " + customUrl);

    fetch(customUrl, { method: 'POST' })
      .then((res) => res.text())
      .then((body) => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          console.log("Error on JSON parse " + err);
          reject(command);
        }
      })
      .catch((error) => {
        console.log("Error on URL request " + error);
        reject(command);
      });
  });
}

module.exports.execute = execute;
module.exports.get_slash = get_slash;
