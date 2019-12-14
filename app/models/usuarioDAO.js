let crypto = require('crypto');

function UsuariosDAO(connection) {
  this._conn = connection;
}

UsuariosDAO.prototype.usuarioSalvar = function (usuario, callback) {
  let senhaCriptograda = crypto.createHash("md5").update(usuario.password).digest("hex");
  usuario.password = senhaCriptograda;
  console.log("Usuários " + usuario);
  this._conn.query('insert into usuarios set ?', usuario, callback);
}

UsuariosDAO.prototype.usuarioAutenticar = function (usuario, callback) {
  let senhaCriptograda = crypto.createHash("md5").update(usuario.password).digest("hex");
  usuario.password = senhaCriptograda;
  let sql = "select * from usuarios where username = '" + usuario.user + "' and password = '" + usuario.password + "'";
  this._conn.query(sql, callback)
}

module.exports = function () {
  return UsuariosDAO;
}


module.exports = function () {

  this.getByEmail = async function (email, connection) {
    let sql = `select * from usuario where email = '${email}'`;
    let collection = await connection.query(sql);
    return collection[0];
  }

  return this;
}