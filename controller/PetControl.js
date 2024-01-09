const Pets = require('../models/Pets');
const Votes = require('../models/VotesAndStats');
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
  if (n<1){
    maxPairings = 0;
  } else {
    maxPairings = n/2*(n-1);
  }
  // console.log("max pairings: " + maxPairings + " id number: " + ids.length);
  if (req.session.pairingsArray.length >= maxPairings){
    return true;
  } else {
    return false;
  };
}
function repeating(req){
  let arr = req.session.pairingsArray;
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
function findLargestId(arr){
  let largest = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > largest ) {
      largest = arr[i];
    }
  }
  return largest;
}
async function pickTwoIds(con){
  let [allId] = await Pets.getAllIds(con);
  let idnums = [];
  for (let e of allId){
    idnums.push(e.ID);
  }
  let largest = findLargestId(idnums)+1; // +1 to compensate for Math.floor rounding downwards
  let picked = [];
  while (picked.length<2){  
    let random = Math.floor(Math.random()*largest); // gives random number that's never a larger number than the largest id
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

function findPercent(n1, n2){
  result = n1 * 100 / (n1+n2);
  return (Math.round(result * 10)/10)
}

async function renameAndAddImage(req, id){
  let newPath = 'public/images/pet' + id + '.png';
  fs.rename(req.file.path, newPath);
  await Pets.addPicture(req.con, newPath.slice(7), id);
}

module.exports = {
  index: async function(req, res){
    if (!req.session.pairingsArray){ // Create session array(of IDs) for new user
      req.session.pairingsArray=[];
    }
    let stats = req.session.agreed;
    if(await maxedOutPairings(req)){
      delete req.session.agreed;
      res.render('index',{agreed: stats});
    } else {
      let ids = await pickTwoIds(req.con);
      req.session.pairingsArray.push(ids);
      while (repeating(req)){
        req.session.pairingsArray.pop();
        ids = await pickTwoIds(req.con);
        req.session.pairingsArray.push(ids);
      }
    console.log("Pet Pairings:")
    console.log(req.session.pairingsArray);
    delete req.session.agreed; // Delete before sending response otherwise it will stay in the next request
    let [pets] = await Pets.getCombatants(req.con, ids[0], ids[1]);
    res.render('index',{pet1: pets[0], pet2: pets[1], agreed: stats});
    }
  },
  vote: async function(req, res){
    let param = req.params.id.slice(1).split('-'); // param[0] is the winner
    await Votes.addVote(req.con, param[0], param[1]);
    let agrees = await Votes.agreed(req.con, param[0], param[1]);
    let percent = findPercent(agrees.win, agrees.lose);
    req.session.agreed = percent;
    res.redirect('/');
  },
  manage: async function(req, res){
    let [petsList] = await Pets.getPets(req.con);
    res.render('manage',{pets: petsList});
  },
  create: async function(req, res){
    let [allSpecies] = await Pets.getSpecies(req.con);
    let oldIssue = req.session.issue;
    delete req.session.issue; // must be deleted before sending response, else it remains in later requests.
    res.render('create', {species: allSpecies, issue: oldIssue});
  },
  store: async function(req, res){
    let name = req.body.name.trim()
    if (name.length<1 || name.length>15){
      req.issue = "Pet's name cannot be empty nor exceed 15 characters";
    }
    // Commented out because form's required option makes this redundant.
    // else if (!req.file){
    //   // req.body.foto = null;
    //   req.issue = 'Pet picture is required.';
    if (req.issue){
      removeUpload(req);
      req.session.issue = req.issue;
      res.redirect('/create');
    } else {
      try{
        if (req.body.newSpecies){
          let speciesId = await Pets.postSpecies(req.con, req.body);
          req.body.species = speciesId;
        }
        let id = await Pets.postPet(req.con, req.body);
        renameAndAddImage(req, id);
      } catch(err){
        console.log(err);
        res.sendStatus(500);
      }
      res.redirect('/');
    }
  },
  delete: async function (req, res){
    try {
    await fs.rm('public/images/pet'+req.params.id+".png");
    } catch(err){
      console.log(err);
    }
    await Pets.delete(req.con, req.params.id);
    req.session.pairingsArray = [];
    res.redirect('/manage');
  },
  update: async function (req, res){
    let id = req.params.id;
    let myPet = await Pets.getOnePet(req.con, id);
    let mySpecies = await Pets.getSpecies(req.con);
    res.render('update',{pet: myPet[0], species: mySpecies[0]});
  },
  put: async function(req, res){
    let id = +req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let species = +req.body.species;
    let oldSpecies = +req.body.oldSpecies;
    if (req.body.newSpecies){
      species = await Pets.postSpecies(req.con, req.body);
    }
    if (req.file){
      renameAndAddImage(req, id);
    }
    Pets.update(req.con, species, name, email, id, oldSpecies);
    res.redirect('/manage');
  }
}