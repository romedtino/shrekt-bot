var filter = require('./channel_filter.js')

function help_info() {
  var help = {};
  help["command"] = "poll";
  help["help"] = "Start a poll. Usage: !poll [Poll Question],[Option 1 emoji],[Option 1 text],[Option 2 emoji],[Option 2 text],...[Option N emoji],[Option N text]";

  return help;
 
}

function execute(command, args, message, client) {
  
  if(command === "poll" && filter(message)) {
    console.log("We are poll");
    var channelID = "asf"
    var pollText = ""
    var pollInfo = args.toString().split(',');
    var emojiList = [];
    
    if(pollInfo.length % 2 == 0) {
      message.channel.send("Bad poll format.");
      return
    }
    pollText += pollInfo[0] + "\n"
    
    //i=1 -- exclude poll question
    for(var i=1;i < pollInfo.length-1;i=i+2)
    {
      emojiList.push(pollInfo[i]);
      
      pollText += pollInfo[i] + " - " + pollInfo[i+1] + "\n"; 
    }
    
    
    client.channels.find("name", channelID).send(pollText)
      .then(function (message) {
          for(var j=0;j<emojiList.length;j++)
          {
              message.react(emojiList[i])
          }
      }).catch(function() {
          message.channel.send("Something went wonky with creating your poll :(");
      });
   // message.channel.send("<@" + message.author.id + "> slaps " + args + " around a bit with a large trout");
  }


}

module.exports.execute = execute;
module.exports.help_info = help_info;
