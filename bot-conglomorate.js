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

  // discord.js v14: interaction.data doesn't exist on command interactions.
  // Options live on interaction.options (CommandInteractionOptionResolver#data).
  const rawOptions = (interaction.options?.data ?? []).map(toRawOption);

  let extraArgs = "";
  if (rawOptions.length) {
    console.log("DEBUG:" + JSON.stringify(rawOptions));
    rawOptions.forEach((e) => {
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
    raw_opt: rawOptions,
  };

  const customUrl = url + command;

  try {
    console.log(`Requesting from bot congo...${JSON.stringify(payload)}`);
    const response = await fetch(customUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Check content type — congo may return plain text (e.g. Discord mentions)
    const contentType = response.headers.get('content-type') || '';
    let body;
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      // Plain text response (e.g. "<@15951143...>") — treat as raw content
      const text = await response.text();
      console.log("[CONGO] Non-JSON response:", text.slice(0, 200));
      await interaction.editReply({ content: text || "Empty response from service." });
      return;
    }

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
 * Reduce a discord.js option object to plain Discord API-shaped data,
 * dropping resolved user/channel/role objects that don't serialize cleanly.
 */
function toRawOption(opt) {
  const raw = { name: opt.name, type: opt.type };
  if (opt.value !== undefined) raw.value = opt.value;
  if (Array.isArray(opt.options)) raw.options = opt.options.map(toRawOption);
  return raw;
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
