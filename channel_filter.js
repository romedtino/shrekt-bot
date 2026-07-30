const whitelist = [
  "1337-speak",
  "cousins-trip",
  "secret-santa-2018",
  "sports",
  "general",
  "shrektonly"
];

module.exports = function filter(message) {
  console.log("Checking channel: " + message.channel.name + " for whitelist.");

  for (const name of whitelist) {
    if (message.channel.name.includes(name)) {
      return true;
    }
  }

  return false;
};
