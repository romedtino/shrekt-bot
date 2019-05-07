var request = require ("request");

var url="https://bot-conglomorate.glitch.me/";

function execute(command, args, message) {
  request({
            url: url,
            json: true
        }, (error, response, body) => {
            message.channel.send(body);
            message.delete()
              .then(() => console.log("message deleted."))
              .catch(console.error);
  });
}