var filter = require('./channel_filter.js')
var imgur = require('imgur');
var sizeOf = require('image-size');
var fs = require('fs');
var mergeImages = require('merge-images');
var Canvas = require('canvas');
var url = require('url');
var https = require('https');

var imgur_ep = 'https://api.imgur.com/3/';
var jsCommand = "brazzers";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Put the Brazzers logo on an image. Usage: `!brazzers [URL to image]`"

  return help;

}

function getImgURL(imgUrl) {
  return new Promise( (resolve, reject) => {
    var options = url.parse(imgUrl);

    https.get(options, function (response) {
      var chunks = [];
      response.on('data', function (chunk) {
        chunks.push(chunk);
      }).on('end', function() {
        var buffer = Buffer.concat(chunks);
        // console.log(sizeOf(buffer));
        resolve(sizeOf);
      });
    });
  });
}

function execute(command, args, message) {
  if(command === jsCommand && filter(message)) {
    var tmpFilename = args[0];
    if(tmpFilename === "") {
      var seconds = new Date() / 1000;
      tmpFilename = String(seconds);
    }
    
    imgur.setAPIUrl(imgur_ep);
    
    let width, height;
    let backgroundColor = '0x000000'
    
    getImgURL('https://i.imgur.com/s5AUpuY.jpg')
      .then( sizeinfo => { 
      width = sizeinfo.width;
      height = sizeinfo.height;
      mergeImages(['https://i.imgur.com/s5AUpuY.jpg', 'https://i.imgur.com/gSnHoXE.jpg'], {
        Canvas: Canvas
      })
        .then( b64 => {
          fs.writeFile(`/tmp/${tmpFilename}`, b64, 'base64', err => console.log(err));
           imgur.uploadFile(`/tmp/${tmpFilename}`, process.env.IMGUR_ALBUM)
        .then(function (json) {
          console.log(json.data.link);
        })
        .catch(function (err) {
          console.error(err.message);
        });
      });
    });
    
    
    
    // var image = gd.open('https://i.imgur.com/s5AUpuY.jpg');
    
    // var watermarked = image.watermark('https://i.imgur.com/gSnHoXE.jpg', {x: 1, y: 1});
    
    // watermarked.save(`/tmp/${tmpFilename}.jpg`);
      
    // imgur.uploadFile(`/tmp/${tmpFilename}`, process.env.IMGUR_ALBUM)
    //   .then(function (json) {
    //     console.log(json.data.link);
    //   })
    //   .catch(function (err) {
    //     console.error(err.message);
    //   });

    
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
