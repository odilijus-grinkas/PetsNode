module.exports = {
  addVote: async function(con, winner, loser){
    await con.query('INSERT INTO votes (pet1_id, pet2_id, result, created_at) VALUES (?,?,?,CURDATE());',[winner, loser, winner]);
  },
  agreed: async function(con, winner, loser){
    let [result] = await con.query('SELECT result as id, COUNT(result) as voteNum FROM votes WHERE pet1_id IN (?,?) AND pet2_id IN (?,?) GROUP BY result',
      [winner,loser,winner,loser]);
    let stats = {};
    let foundWinner = false;
    for (let e of result){
      if (e.id == +winner){
        stats.win = e.voteNum;
        foundWinner = true;
      } else if (e.id == +loser){ 
        stats.lose = e.voteNum;
      } 
    }
    if (result.length<2){// If one of the choices has never had any votes.
      if (foundWinner){
        stats.lose = 0;
      } else {
        stats.win = 0;
      }
    }
    return stats
  }
}