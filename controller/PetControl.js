const Pets = require('../models/Pets');
const Votes = require('../models/Votes');
const fs = require('fs/promises'); // File management system for moving photos.
const math = require('mathjs');

function removeUpload(req){
  if (req.file){
    fs.rm(req.file.path);
  }
}
async function maxedOutPairings(req){
  let [ids] = await Pets.getAllIds(req.con);
  let n = ids.length; // How many ids?
  let maxPairings;
  if (n<2){
    maxPairings = 1;
  } else if (n<1){
    maxPairings = 0;
  } else {
    // Complicated formula that calculates the maximum number of unique pairings, cannot handle >150 ids :(
    maxPairings = math.factorial(n)/(2*math.factorial(n-2));
  }
  // console.log("max pairings: " + maxPairings + " id number: " + ids.length);
  if (req.session.arr.length >= maxPairings){
    return true;
  } else {
    return false;
  };
}
function repeating(req){
  let arr = req.session.arr;
  let repeating = false;
  for (let i = 0; i<arr.length; i++){
    for (let e = i+1; e<arr.length; e++){
      if (arr[i].toString()==arr[e].toString()) {
        repeating = true;
        break;
      }
    }
  }
  return repeating;
}
async function pickTwoIds(con){
  let [allId] = await Pets.getAllIds(con);
  let idnums = [];
  for (let e of allId){
    idnums.push(e.ID);
  }
  let lastId = idnums[idnums.length-1]+1; //+1 because math.floor will return smaller number than the one provided
  let picked = [];
  while (picked.length<2){  
    let random = Math.floor(Math.random()*lastId); // gives random number that's never a larger number than the last pet's id
    for (let i = 0; i<idnums.length; i++){
      if (random == idnums[i]){
        picked.push(idnums[i]);
        idnums[i] = null; // remove element from equation
      }
    }
  }
  // This part is added to make checking for repeated pet pairings simpler
  if (picked[0]>picked[1]){
    let moveLeft = picked.pop();
    picked.unshift(moveLeft);
  }
  return picked;
}
module.exports = {
  index: async function(req, res){
    if (!req.session.arr){ // Create session array(of IDs) for new user
      req.session.arr=[];
    }
    if(await maxedOutPairings(req)){
      res.render('index');
    } else {
      let ids = await pickTwoIds(req.con);
      req.session.arr.push(ids);
      while (repeating(req)){
        req.session.arr.pop();
        ids = await pickTwoIds(req.con);
        req.session.arr.push(ids);
      }
    console.log("Pet Pairings:")
    console.log(req.session.arr);
    let [pets] = await Pets.getCombatants(req.con, ids[0], ids[1]);
    res.render('index',{pet1: pets[0], pet2: pets[1]});
    }
  },
  vote: async function(req, res){
    let param = req.params.id.slice(1).split('-'); // param[0] is the winner
    Votes.addVote(req.con, param[0], param[1]);
    res.redirect('/');
  },
  manage: async function(req, res){
    let [petsList] = await Pets.getPets(req.con);
    res.render('manage',{pets: petsList});
  },
  create: async function(req, res){
    res.render('create');
  },
  store: async function(req, res){
    if (req.body.name.length<2){
      req.issue = "Pets shouldn't have 1 letter long names.";
    } 
    // Commented out because form's required option makes this redundant.
    // else if (!req.file){
    //   // req.body.foto = null;
    //   req.issue = 'Pet picture is required.';
    // }
    if (req.issue){
      removeUpload(req);
      res.render('create', {issue: req.issue})
    } else {
      try{
        let id = await Pets.postPet(req.con, req.body);
        let newPath = 'public/images/pet' + id + '.png';
        fs.rename(req.file.path, newPath);
        await Pets.addPicture(req.con, newPath.slice(7), id);
      } catch(err){
        console.log(err);
        res.sendStatus(500);
      }
      res.redirect('/');
    }
  },
  delete: function (req, res){
    // Include deleting removed pet's id from req.session.arr 
  }
}