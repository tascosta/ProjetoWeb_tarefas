let mysql = require('mysql');
let conexaoMysql = function () {
    console.log("Conexao iniciada com sucesso!")
    return conexao = mysql.createConnection({
        host: 'localhost',
        user: 'talita',
        password: '123456',
        database: 'tarefa'
    });
}

module.exports = function () {
    return conexaoMysql;
}



