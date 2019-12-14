module.exports = function () {

  const DATE_FORMAT = '%d/%m/%Y %H:%i';

  this.getTarefas = async function(idUsuario, connection) {
    let sql = `select id, id_usuario, descricao, progresso, date_format(created_at, '${DATE_FORMAT}') as created_at  
               from tarefa 
               where id_usuario = ${idUsuario}`;
    return await connection.query(sql);
  }

  this.atualizarTarefa = async function(tarefa, connection) {
    let sql = `update tarefa set descricao = '${tarefa.descricao}', progresso = ${tarefa.progresso}, created_at = str_to_date('${tarefa.created_at}', '%Y-%m-%d %H:%i:%s') where id = ${tarefa.id}`;
    return await connection.query(sql);
  }

  return this;
}
