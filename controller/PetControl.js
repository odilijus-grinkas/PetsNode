const Pets = require('../models/Pets');
const Votes = require('../models/Votes');
const fs = require('fs/promises'); // File management system for moving photos.

function removeUpload(req){
  if (req.file){
    fs.rm(req.file.path);
  }
}
module.exports = {
  index: async function(req, res){
    // Add randomizer that selects which ids from getAllIds to pass to render
    let [pets] = await Pets.getCombatants(req.con, 1, 2);
    res.render('index',{pet1: pets[0], pet2: pets[1]});
    // res.render('index');
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