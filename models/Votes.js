module.exports = {
  addVote: function(con, winner, loser){
    con.query('INSERT INTO votes (pet1_id, pet2_id, result, created_at) VALUES (?,?,?,CURDATE());',[winner, loser, winner]);
  }
}