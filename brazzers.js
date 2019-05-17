var filter = require('./channel_filter.js')
var imgur = require('imgur');
var fs = require('fs');
var jimp = require('jimp');

var jsCommand = "brazzers";

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Put the Brazzers logo on an image. Usage: `!brazzers [URL to image]`"

  return help;

}

function brazzit(message, args) {
  var tmpFilename = args[0];
  if(!tmpFilename) {
    tmpFilename = 'https://i.imgur.com/s5AUpuY.jpg';
  }
  
  var seconds = new Date() / 1000;
  const outfile = `/tmp/brazzers${seconds}.jpg`;
  
  var brazzersLogoURL = 'https://i.imgur.com/gSnHoXE.jpg';
  jimp.read(brazzersLogoURL)
    .then( image => {
      
      jimp.read(tmpFilename)
        .then( targetImg => {
          image.resize(targetImg.bitmap.width * 0.3, jimp.AUTO);
          targetImg.blit(image, targetImg.bitmap.width - image.bitmap.width - 20, 
                         targetImg.bitmap.height - image.bitmap.height - 20);
          targetImg.write(outfile, () => {
                message.channel.send(`<@${message.author.id}> here ya go`, {
                          files: [`${outfile}`]
                        });
            });
        })
        .catch( e => console.log(e) );
  
    })
    .catch( e => console.log(e) );
  

}

function execute(command, args, message) {
  if(command === jsCommand && filter(message)) {
    var brazzersLogoURL = 'https://i.imgur.com/gSnHoXE.jpg';
    var tmpFilename = args[0];
    if(!tmpFilename) {
      tmpFilename = 'https://i.imgur.com/s5AUpuY.jpg';
    }
    var ext = tmpFilename.split('.').pop();
    console.log(tmpFilename);
    
    var seconds = new Date() / 1000;
    
    brazzit(message, args);    
  }
}

module.exports.execute = execute;
module.exports.help_info = help_info;
