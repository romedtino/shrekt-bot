var filter = require('./channel_filter.js')
var imgur = require('imgur');
var watermark = require('watermarkjs');

var imgur_ep = 'https://api.imgur.com/3/'

var jsCommand = "brazzers";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Put the Brazzers logo on an image. Usage: `!brazzers [URL to image]`"

  return help;

}

function execute(command, args, message) {
  if(command === jsCommand && filter(message)) {
    
    watermark(['https://i.imgur.com/s5AUpuY.jpg', 'http://i.imgur.com/Ebb75ej.jpg'])
      .image( (image1, image2) => {
        var context = image1.getContext('2d');
        context.save();
        
        context.globalAlpha = alpha;
        context.drawImage(image2, 10, 10);
        
        context.restore();
        return target;
    });
    
    // request({
    //         url: cat,
    //         json: true
    //     }, function (error, response, body) {
    //         if(body.file === undefined )
    //         {
    //           message.channel.send("<@" + message.author.id +"> Sorry the meow API is overloaded... try again later.");
    //         }
    //         else {
    //           message.channel.send("<@" + message.author.id + "> meow! " + body.file);
    //           message.delete()
    //             .then(() => console.log("message deleted."))
    //             .catch(console.error);
    //         }
    // });
  }

}

module.exports.execute = execute;
module.exports.help_info = help_info;
