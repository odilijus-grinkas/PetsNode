const Pets = require('../models/Pets');
const fs = require('fs/promises'); // File management system for moving photos.

function removeUpload(req){
  if (req.file){
    fs.rm(req.file.path);
  }
}
module.exports = {
  index: function(req, res){
    res.render('index');
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
  }
}