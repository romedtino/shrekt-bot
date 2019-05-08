var request = require ("request");

var url="https://bot-conglomorate.glitch.me/";

function execute(command, args, message) {
    
  var payload = { "arg0" : message.author.id };
  payload = ["arg0"] = message.author.id;
  
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

function help(command) {
  return new Promise( (resolve, reject) => {
    var customUrl = url + command + "/help";

    request.get(customUrl, (error, res, body) => {
      resolve(body);
    });
  });
}

module.exports.execute = execute;
module.exports.help = help;