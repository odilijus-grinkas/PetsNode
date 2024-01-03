const Votes = require('../models/Votes');

module.exports = {
  stats: async function (req, res){
    res.render('stats');
  }
}