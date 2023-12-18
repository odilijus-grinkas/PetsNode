module.exports = {
  getPets: function(con){
    return con.query("SELECT * FROM pets");
  }
}