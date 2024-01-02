module.exports = {
  // Full pet info, for managing
  getPets: function(con){
    // return con.query("SELECT id, species_id, name, foto, email, created_at FROM pets");
    return con.query("SELECT pets.id, species.name AS species, pets.name, foto, email, DATE(created_at) AS created_at FROM pets JOIN species ON species_id = species.id");
  },
  getCombatants: function(con, id1, id2){
    return con.query("SELECT id, name, foto FROM pets WHERE id IN (?,?)", [id1, id2]);
  },
  getAllIds: function(con){
    return con.query("SELECT ID FROM pets");
  },
  // Expects a pet object containing: {name, email, species, foto}
  postPet: async function(con, pet){ 
    try{
      await con.query("INSERT INTO pets (species_id, name, email, created_at) VALUES (?,?,?,CURDATE())",
      [pet.species, pet.name, pet.email]);
      let result = await con.query('SELECT id FROM pets WHERE name = ?',[pet.name]);
      if (result[0].length>1){ //In case pets share same names, get the last one's id
        result = result[0][result[0].length-1];
      } else {
        result = result[0][0];
      }
      return result.id;
    } catch(err){
      console.log(err);
    }
  },
  addPicture: async function(con, path, id){
    try{
      await con.query("UPDATE pets SET foto = ? WHERE id = ?", [path,id]);
    } catch(err){
      console.log(err);
    }
  }
}