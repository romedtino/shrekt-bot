var filter = require('./channel_filter.js');

var jsCommand = "mb";

var type_images = {};
type_images["intj"] = "https://storage.googleapis.com/neris/public/images/types/intj-architect.svg";
type_images["intp"] = "https://storage.googleapis.com/neris/public/images/types/intp-logician.svg";
type_images["entj"] = "https://storage.googleapis.com/neris/public/images/types/entj-commander.svg";
type_images["entp"] = "https://storage.googleapis.com/neris/public/images/types/entp-debater.svg";

type_images["infj"] = "https://storage.googleapis.com/neris/public/images/types/infj-advocate.svg";
type_images["infp"] = "https://storage.googleapis.com/neris/public/images/types/infp-mediator.svg";
type_images["enfj"] = "https://storage.googleapis.com/neris/public/images/types/enfj-protagonist.svg";
type_images["enfp"] = "https://storage.googleapis.com/neris/public/images/types/enfp-campaigner.svg";

type_images["istj"] = "https://storage.googleapis.com/neris/public/images/types/istj-logistician.svg";
type_images["isfj"] = "https://storage.googleapis.com/neris/public/images/types/isfj-defender.svg";
type_images["estj"] = "https://storage.googleapis.com/neris/public/images/types/estj-executive.svg";
type_images["esfj"] = "https://storage.googleapis.com/neris/public/images/types/esfj-consul.svg";

type_images["istp"] = "https://storage.googleapis.com/neris/public/images/types/istp-virtuoso.svg";
type_images["isfp"] = "https://storage.googleapis.com/neris/public/images/types/isfp-adventurer.svg";
type_images["estp"] = "https://storage.googleapis.com/neris/public/images/types/estp-entrepreneur.svg";
type_images["esfp"] = "https://storage.googleapis.com/neris/public/images/types/esfp-entertainer.svg";


// { name, type }
var Datastore = require('nedb'), 
    // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    db = new Datastore({ filename: '.data/mbDatafile', autoload: true });

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Look up or assign someone's Myer Brigg's personality type. Usage: `!" + jsCommand + "[@username][add @username][remove @username]`"

  return help;

}


function findByName(query) {
  db.find({ name: query }, function(err, docs) {
    if(!err) {
      return docs;
    }
  });
}

function findByType(query) {
  db.find({ type: query }, function(err, docs) {
    
  });
}

function insert(message, name, type) {
  var entry = { "name" : name,
               "type" : type };
  
  db.insert( entry, function(err, newDoc) {
      if(!err) {
        message.channel.send("Added personality [" + type + "] for: " + name );
      } else {
        message.channel.send("Failed adding personality to list")
      }
  });
}

function remove(message, name) {
  db.remove( { "name" : name }, {}, function(err, numRemoved) {
    if(!err) {
      message.channel.send("Removed " + numRemoved + " entry");
    } else {
      message.channel.send("Failed to remove entry");
    }
  });
}

function mb(command, args, message) {
  if(command === jsCommand && filter(message)) {
    //message.channel.send("<@" + message.author.id + "> farts on " + args + " with a soft soggy wet one");
  }

}

module.exports = mb;
module.exports.help_info = help_info;