var filter = require('./channel_filter.js');

var jsCommand = "mb";

var type_images = {};
type_images["intj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/mastermind-intj.png";
type_images["intp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/thinker-intp.png";
type_images["entj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/commander-entj.png";
type_images["entp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/visionary-entp.png";

type_images["infj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/counselor-infj.png";
type_images["infp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/idealist-infp.png";
type_images["enfj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/giver-enfj.png";
type_images["enfp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/champion-enfp.png";

type_images["istj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/inspector-istj.png";
type_images["isfj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/nurturer-isfj.png";
type_images["estj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/supervisor-estj.png";
type_images["esfj"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/provider-esfj.png";

type_images["istp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/craftsman-istp.png";
type_images["isfp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/10/isfp-the-composer-avatar.jpg";
type_images["estp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/doer-estp.png";
type_images["esfp"] = "http://www.personalityperfect.com/wp-content/uploads/2015/09/performer-esfp.png";


// { name, type }
var Datastore = require('nedb'), 
    // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    db = new Datastore({ filename: '.data/mbDatafile', autoload: true });

function help_info() {
  var help = {};
  help["command"] = jsCommand;
  help["help"] = "Look up or assign someone's Myer Brigg's personality type. Usage: `!mb [@username][add @username type][remove @username]`\n e.g. `!mb add @darkamikaze intj"

  return help;

}


function findByName(message, query) {
  console.log("findByName");
  db.find({ name: query }, function(err, docs) {
    var retMessage = "";
    if(!err) {
      if(docs.length <= 0) {
        retMessage += "No entry for " + query;
      }
      for(let elem of docs) {
          var dashIndex = elem.type.indexOf('-');
          var modType = elem.type;
        console.log("bef modType: " + modType);
          if(dashIndex > -1) {
            modType = modType.substring(0, dashIndex);
          }
        console.log("modType: " + modType);
        retMessage += elem.name + " is a " + type_images[modType.toLowerCase()];
      }
    } else {
      retMessage += "Could not find " + query;
    }
    
    message.channel.send(retMessage);
  });
}

function findByType(message, query) {
  console.log("findByType");
  db.find({ type: query }, function(err, docs) {
    var retMessage = "";
    if(!err) {
      var dashIndex = query.indexOf('-');
      var modType = query;
      if(dashIndex > -1) {
        modType = modType.substring(0, dashIndex);
      }
      
      retMessage += "People with personality type: " + query.toUpperCase() + " " + type_images[modType.toLowerCase()];
      
      if(docs.length <= 0) {
        retMessage += "\nNo one has this personality type.";
      }
      for(let elem of docs) {
        retMessage += "\n- " + elem.name + "-\t" + elem.type.toUpperCase();
      }
    } else {
      retMessage += "Could not find " + query;
    }
    
    message.channel.send(retMessage);
  });
}

function findAll(message) {
  console.log("findAll");
// Find all documents in the collection
db.find({}).sort({type: 1}).exec(function (err, docs) {
  var retMessage = "";
    if(!err) {
      if(docs.length <= 0) {
        retMessage += "\nNo entries found.";
      }
      for(let elem of docs) {
        retMessage += "\n" + elem.name + " \t" + elem.type.toUpperCase();
      }
    } else {
      retMessage += "Could not find entries";
    }
  message.channel.send(retMessage);
 });
}

function insert(message, name, type) {
  console.log("insert");

  var entry = { "name" : name,
               "type" : type };
  
  if(name.indexOf("@") < 0) {
    message.channel.send("Please use @name to assign a name");
    return;
  }
  
  var dashIndex = type.indexOf('-');
  var modType = type;
  if(dashIndex > -1) {
        modType = modType.substring(0, dashIndex);
      }
  if(type_images[modType.toLowerCase()] === undefined) {
    message.channel.send("Unrecognized type: " + type);
    return;
  }
  
  db.insert( entry, function(err, newDoc) {
      if(!err) {
        message.channel.send("Added personality [" + type + "] for: " + name );
      } else {
        message.channel.send("Failed adding personality to list")
      }
  });
}

function remove(message, name) {
  console.log("remove");
  
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
    var req = args[0];
    console.log(req);
    if(req === undefined) {
      findAll(message);
    } else if(req === "add") {
      if(args[1] === undefined || args[2] === undefined) 
      {
        message.channel.send("Invalid add.");
      } else {
        var lowered = args[1].toLowerCase();
        insert(message, lowered, args[2]);
      }
    } else if(req === "remove") {
      if(args[1] === undefined)
      {
        message.channel.send("Invalid remove.");
      } else {
        remove(message, args[1]);
      }
    } else if(req.indexOf('@') > -1) {
      findByName(message, args[0]);
    } else {
      findByType(message, args[0]);
    }
    
  }

}

module.exports = mb;
module.exports.help_info = help_info;