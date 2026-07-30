const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});

app.listen(process.env.PORT);

/**
 * Start the Discord bot with a short delay so the HTTP server is ready first.
 */
function execute() {
  try {
    require('./run_discord.js');
  } catch (err) {
    console.error("Failed to start Discord bot:", err);
  }
}

setTimeout(execute, 5000);
