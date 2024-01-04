module.exports = {
  addVote: async function(con, winner, loser){
    let nums = [];
    if (+winner > +loser){
      nums.push(loser);
      nums.push(winner);
      nums.push(2);
    } else {
      nums.push(winner);
      nums.push(loser);
      nums.push(1);
    }
    await con.query('INSERT INTO votes (pet1_id, pet2_id, result, created_at) VALUES (?,?,?,CURDATE());',[nums[0], nums[1], nums[2]]);
  },
  agreed: async function(con, winner, loser){
    let [result] = await con.query('SELECT COUNT(result) AS res FROM votes WHERE pet1_id IN(?,?) AND pet2_id IN(?,?) GROUP BY result', [winner,loser,winner,loser]);
    let stats = {win:0, lose:0};
    winnerBigger = false;
    if (+winner > +loser){
      winnerBigger = true;
    }
    if (winnerBigger){
      stats.win = result[1].res;
      stats.lose = result[0].res;
    } else {
      stats.win = result[0].res;
      stats.lose = result[1].res;
    }
    return stats
  }
}