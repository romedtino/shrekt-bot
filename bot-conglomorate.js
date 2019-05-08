var request = require ("request");

var url="https://bot-conglomorate.glitch.me/";

function execute(command, payload, message) {
    
  payload["arg0"] = message.author.id;
  
  var customUrl = url + command;
  
  request.post({
            url: customUrl,
            json: payload
        }, (error, response, body) => {
            message.channel.send(body);
            message.delete()
              .then(() => console.log("message deleted."))
              .catch(console.error);
  });
}

module.exports.execute = execute;