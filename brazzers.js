var filter = require('./channel_filter.js')
var imgur = require('imgur');
var fs = require('fs');
var mergeImages = require('merge-images');
var sharp = require('sharp');
const Canvas = require('canvas');
var request = require('request');
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
      
      request('https://i.imgur.com/s5AUpuY.jpg', { encoding: 'binary'}, (err, res, body) => {
        fs.writeFile('img1.jpg', body, 'binary', err => {
            request('https://i.imgur.com/gSnHoXE.jpg', { encoding: 'binary'}, (err2, res2, body2) => {
              fs.writeFile('img2.jpg', body2, 'binary', err => {
                sharp('img1.jpg')
                  .resize( { height: 1080 })
                  .toFile('img1.png')
                  .then( data => {
                    sharp('img2.jpg')
                      .resize( {
                  })
                  .catch( err => console.log(err));
                
                  .composite([{input: 'img2.jpg', gravity: sharp.gravity.southeast }])
                  .toFile('/tmp/brazzers.png')
                  .then( data => {
                    message.channel.send(`<@${message.author.id}> here ya go`, {
                        files: ['/tmp/brazzers.png']
                      });
                  })
                  .catch( err => console.log(err));
              });
            
          });
        });

      });
    
      // sharp('https://i.imgur.com/s5AUpuY.jpg')
      //   .composite([{input: 'https://i.imgur.com/gSnHoXE.jpg', gravity: sharp.gravity.southeast }])
      //   .toFile('/tmp/brazzers.png')
      //   .then( data => {
      //     message.channel.send(`<@${message.author.id}> here ya go`, {
      //         files: ['/tmp/brazzers.png']
      //       });
      //   })
      //   .catch( err => console.log(err));
    
      // mergeImages(['https://i.imgur.com/s5AUpuY.jpg', 'https://i.imgur.com/gSnHoXE.jpg'], {
      //   Canvas: Canvas
      // })
      //   .then( b64 => {
      //     fs.writeFile("/tmp/brazzers.png", b64, 'base64', err => {
      //       if(err) {
      //         console.log(err)
      //       } else {
      //         message.channel.send(`<@${message.author.id}>`, {
      //           files: ['https://i.imgur.com/s5AUpuY.jpg']
      //         });
      //       }
      //     });
      //    });
          
    
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
