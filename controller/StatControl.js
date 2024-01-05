const VotesAndStats = require('../models/VotesAndStats');
const Votes = require('../models/VotesAndStats');

module.exports = {
  stats: async function (req, res){
    let dayWin = await VotesAndStats.dayWinner(req.con); //object
    let weekWin = await VotesAndStats.weekWinner(req.con); //object
    let monthWin = await VotesAndStats.monthWinner(req.con); //object
    let speciesNum = await VotesAndStats.speciesByNum(req.con); //array
    let speciesWin = await VotesAndStats.speciesByWins(req.con); //array
    let mostVotedPet = await VotesAndStats.mostVotedPet(req.con); //object
    // console.log(dayWin)
    // console.log(weekWin)
    // console.log(monthWin)
    // console.log(speciesNum)
    // console.log(speciesWin)
    // console.log(mostVotedPet)

    res.render('stats', {day: dayWin, week: weekWin, month: monthWin, speciesN: speciesNum, speciesW: speciesWin, bestPet: mostVotedPet});
  }
}