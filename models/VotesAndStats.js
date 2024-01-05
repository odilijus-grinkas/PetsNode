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
  },
  dayWinner: async function(con){
    let [[result]] = await con.query('SELECT result AS id, pets.name, pets.foto, COUNT(result) AS voteNum FROM votes JOIN pets ON pets.id = result WHERE votes.created_at = CURDATE() GROUP BY result ORDER BY voteNum DESC LIMIT 1');
    return result
  },
  weekWinner: async function(con){
    let [[result]] = await con.query('SELECT result as id, pets.name, pets.foto, COUNT(result) as voteNum FROM votes JOIN pets ON pets.id = votes.result WHERE WEEK(votes.created_at) = WEEK(CURDATE()) GROUP BY result ORDER BY voteNum DESC LIMIT 1');
    return result
  },
  monthWinner: async function(con){
    let [[result]] = await con.query('SELECT result as id, pets.name, pets.foto, COUNT(result) as voteNum FROM votes JOIN pets ON pets.id = votes.result WHERE MONTH(votes.created_at) = MONTH(CURDATE()) GROUP BY result ORDER BY voteNum DESC LIMIT 1');
    return result
  },
  speciesByNum: async function(con){
    let [result] = await con.query('SELECT species.name as speciesName, COUNT(species.name) AS speciesNum FROM pets JOIN species ON species.id = pets.species_id GROUP BY species.name');
    return result
  },
  speciesByWins: async function(con){
    let [result] = await con.query('SELECT species.name, COUNT(result) as voteNum FROM pets JOIN votes ON votes.result = pets.id JOIN species ON species.id = pets.species_id GROUP BY species.name ORDER BY voteNum DESC');
    return result
  },
  mostVotedPet: async function(con){
    let [[result]] = await con.query('SELECT pets.id, pets.foto, pets.name, COUNT(result) AS voteNum FROM pets JOIN votes ON votes.result = pets.id GROUP BY result ORDER BY voteNum DESC LIMIT 1');
    return result
  }
}