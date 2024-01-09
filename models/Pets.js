module.exports = {
  // Full pet info, for managing
  getPets: function(con){
    return con.query("SELECT pets.id, species.name AS species, pets.name, foto, email, DATE(created_at) AS created_at FROM pets JOIN species ON species_id = species.id ORDER BY pets.id");
  },
  getOnePet: async function(con, id){
    let [pet] = await con.query("SELECT * FROM pets WHERE id = ?", [id]);
    return pet;
  },
  getCombatants: function(con, id1, id2){
    return con.query("SELECT id, name, foto FROM pets WHERE id IN (?,?)", [id1, id2]);
  },
  getAllIds: function(con){
    return con.query("SELECT ID FROM pets");
  },
  getSpecies: function(con){
    return con.query("SELECT * FROM species");  
  },
  postSpecies: async function(con, body){
    try{
      await con.query("INSERT INTO species (name) VALUES (?)",[body.newSpecies]);
      let [ids] = await con.query("SELECT id FROM species");
      return ids[ids.length-1].id
    } catch(err){
      console.log(err);
    }
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
      console.log('HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
      console.log(pet);
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
  },
  delete: async function(con, id){
    try{
      let [[speciesId]] = await con.query("SELECT species_id FROM pets WHERE pets.id = ?", [id]);
      await con.query("DELETE FROM pets WHERE pets.id = ?", [id]);
      this.deleteSpecies(con, speciesId.species_id)
    } catch(err){
      console.log(err);
    }
  },
  update: async function(con, speciesId, name, email, id, oldSpecies){
    try{
      await con.query ("UPDATE pets SET species_id = ?, name = ?, email = ? WHERE id = ?", [speciesId, name, email, id]);
      console.log('------------------------');
      console.log(oldSpecies);
      await this.deleteSpecies(con, oldSpecies);
    } catch (err){
      console.log(err);
    }
  },
  deleteSpecies: async function(con, speciesId){
    let [species] = await con.query("SELECT * FROM species JOIN pets ON pets.species_id = species.id WHERE species.id = ?", [speciesId]);
    if(species.length <= 0 && speciesId != 1 && speciesId != 2){
      console.log("HELLOT HEREHERHEHREHRHEHRE")
      await con.query("DELETE FROM species WHERE id = ?", [speciesId]);
    }
  }

}