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
    var brazzersLogoURL = 'https://i.imgur.com/gSnHoXE.jpg';
    var tmpFilename = args[0];
    if(args[0] === "") {
      tmpFilename = 'https://i.imgur.com/s5AUpuY.jpg';
    }
      console.log(tmpFilename);
      fs.unlinkSync('/tmp/img1.jpg');
      fs.unlinkSync('/tmp/img1.jpg');
      request(tmpFilename, { encoding: 'binary'}, (err, res, body) => {
        fs.writeFile('/tmp/img1.jpg', body, 'binary', err => {
            request(brazzersLogoURL, { encoding: 'binary'}, (err2, res2, body2) => {
              fs.writeFile('/tmp/img2.jpg', body2, 'binary', err => {
                sharp('/tmp/img1.jpg')
                  .resize( { width: 1920 })
                  .toFile('/tmp/img1r.png')
                  .then( () => {
                    sharp('/tmp/img2.jpg')
                      .resize( { width: 480 })
                      .toFile('/tmp/img2r.png')
                      .then( () => {
                          sharp('/tmp/img1r.png')
                            .composite([{input: '/tmp/img2r.png', gravity: sharp.gravity.southeast }])
                            .toFile('/tmp/brazzers.png')
                            .then( data => {
                              message.channel.send(`<@${message.author.id}> here ya go`, {
                                  files: ['/tmp/brazzers.png']
                                });
                            })
                            .catch( err => console.log(err));
                      })
                      .catch( err => console.log(err));
                  })
                  .catch( err => console.log(err));
                
                  
              });
            
          });
        });

      });
    
  }

}

module.exports.execute = execute;
module.exports.help_info = help_info;
