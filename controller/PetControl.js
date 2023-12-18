const Pets = require('../models/Pets');

module.exports = {
  index: function(req, res){
    res.render('index');
  },
  manage: async function(req, res){
    let [petsList] = await Pets.getPets(req.con);
    res.render('manage',{pets: petsList});
  }
}