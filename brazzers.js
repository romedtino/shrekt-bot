var filter = require('./channel_filter.js')
var imgur = require('imgur');
var image
var imgur_ep = 'https://api.imgur.com/3/';

var jsCommand = "brazzers";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Put the Brazzers logo on an image. Usage: `!brazzers [URL to image]`"

  return help;

}

function execute(command, args, message) {
  if(command === jsCommand && filter(message)) {
    var tmpFilename = args[0];
    if(tmpFilename === "") {
      var seconds = new Date() / 1000;
      tmpFilename = String(seconds);
    }
    
    imgur.setAPIUrl(imgur_ep);
    
    let mc = new MC({
      
    });
    
    // var image = gd.open('https://i.imgur.com/s5AUpuY.jpg');
    
    // var watermarked = image.watermark('https://i.imgur.com/gSnHoXE.jpg', {x: 1, y: 1});
    
    // watermarked.save(`/tmp/${tmpFilename}.jpg`);
      
    imgur.uploadFile(`/tmp/${tmpFilename}`, process.env.IMGUR_ALBUM)
      .then(function (json) {
        console.log(json.data.link);
      })
      .catch(function (err) {
        console.error(err.message);
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
