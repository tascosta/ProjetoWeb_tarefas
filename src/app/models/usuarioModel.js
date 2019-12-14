module.exports = function () {

  this.getByEmail = async function(email, connection) {
    let sql = `select * from usuario where email = '${email}'`;
    let collection = await connection.query(sql);
    return collection[0];
  }

  return this;
}