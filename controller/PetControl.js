const Pets = require('../models/Pets');
const Votes = require('../models/Votes');
const fs = require('fs/promises'); // File management system for moving photos.

function removeUpload(req){
  if (req.file){
    fs.rm(req.file.path);
  }
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
    for (let e of idnums){
      if (random == e){
        picked.push(e);
        idnums[e-1] = null; // remove element from equation
      }
    }
  }
  return picked;
}
module.exports = {
  index: async function(req, res){
    let ids = await pickTwoIds(req.con);
    let [pets] = await Pets.getCombatants(req.con, ids[0], ids[1]);
    res.render('index',{pet1: pets[0], pet2: pets[1]});
  },
  manage: async function(req, res){
    let [petsList] = await Pets.getPets(req.con);
    console.log(petsList[0])
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
  vote: async function(req, res){
    let param = req.params.id.slice(1).split('-'); // param[0] is the winner
    Votes.addVote(req.con, param[0], param[1]);
    res.redirect('/');
  }
}