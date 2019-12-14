module.exports = function() {

  let getUsuario = async function(app, email) {
    let db = app.config.dbConnection();
    let usuarioDAO = app.models.usuarioDAO;

    let usuario = await usuarioDAO.getByEmail(email, db);
    
    try {
      await db.close();
    }
    catch(err) {}
    
    return usuario;
  }

  let getTarefa = async function(app, id) {
    let db = app.config.dbConnection();
    let tarefaDAO = app.models.tarefaDAO;

    let tarefa = await tarefaDAO.getTarefa(id, db);
    
    try {
      await db.close();
    }
    catch(err) {}
    
    return tarefa;
  }

  let buildErrorResponse = function(res, code, error) {
    res.status(code);
    let mensagem = '';
    let detalhes = '';

    if(typeof error === 'string') {
      mensagem = error;
    }
    else {
      mensagem = 'Erro interno no servidor';
    }

    console.log(error);

    return {
      mensagem, code, detalhes
    };
  }

  this.routeError = function(res, code, error) {
    return buildErrorResponse(res, code, error);
  }

  this.apiRouteMiddleware = async function(app, req, res, next) {
    try {

      if(req.params.account) {
        
        let usuario = await getUsuario(app, req.params.account);

        if(usuario) {
          req.usuario = usuario;
        }
        else {
          res.send(buildErrorResponse(res, 404, 'Usuário não existe.'));
          return;
        }
      }
      
      if(req.params.tarefa) {
        let tarefa = await getTarefa(app, req.params.tarefa);

        if(tarefa) {
          req.tarefa = tarefa;
        }
        else {
          res.send(buildErrorResponse(res, 404, 'Tarefa não existe.'));
          return;
        }
      }

      return next();
    }
    catch(err) {
      res.send(buildErrorResponse(res, 500, err));
    }
  }

  this.getTarefas = async function(app, req, res) {
    let db = app.config.dbConnection();
    let api = app.models.api;
    let tarefas = [];

    if(req.usuario) {
      try {
        tarefas = await api.getTarefas(req.usuario.id, db);
        res.send(tarefas);
      }
      catch(err) {
        res.send(buildErrorResponse(res, 500, err));
      }
      finally {
        try {
          await db.close();
        }
        catch(err) {}
      }
    }
    else {
      res.send(buildErrorResponse(res, 400, 'E-mail do usuário é obrigatório.'));
    }
  }

  this.getTarefa = async function(app, req, res) {
    let db = app.config.dbConnection();

    if(req.tarefa) {
      try {
        res.send(req.tarefa);
      }
      catch(err) {
        res.send(buildErrorResponse(res, 500, err));
      }
      finally {
        try {
          await db.close();
        }
        catch(err) {}    
      }
    }
    else {
      res.send(buildErrorResponse(res, 400, 'Identificador da tarefa é obrigatório.'));
    }
  }
  
  this.criaTarefa = async function(app, req, res) {
    let db = app.config.dbConnection();
    let tarefaDAO = app.models.tarefaDAO;
    let tarefaDto = req.body;

    if(req.usuario) {
      try {
        let tarefa = {
          id_usuario: req.usuario.id,
          descricao: tarefaDto.descricao,
          created_at: tarefaDto.data,
          progresso: 0
        }

        let row = await tarefaDAO.inserirTarefa(tarefa, db);
        tarefa = await tarefaDAO.getTarefa(row.insertId, db);
        res.status(200);
        res.send(tarefa);
      }
      catch(err) {
        res.send(buildErrorResponse(res, 500, err));
      }
      finally {
        try {
          await db.close();
        }
        catch(err) {} 
      }
    }
    else {
      res.send(buildErrorResponse(res, 400, 'E-mail do usuário é obrigatório.'));
    }
  }

  this.atualizaTarefa = async function(app, req, res) {
    let db = app.config.dbConnection();
    let tarefaDAO = app.models.tarefaDAO;
    let api = app.models.api;
    let tarefaDto = req.body;

    if(req.tarefa) {
      try {
        let tarefa = {
          id: req.tarefa.id,
          descricao: tarefaDto.descricao,
          created_at: tarefaDto.data,
          progresso: tarefaDto.progresso
        }

        await api.atualizarTarefa(tarefa, db);
        tarefa = await tarefaDAO.getTarefa(tarefa.id, db);
        res.status(200);
        res.send(tarefa);
      }
      catch(err) {
        res.send(buildErrorResponse(res, 500, err));
      }
      finally {
        try {
          await db.close();
        }
        catch(err) {} 
      }
    }
    else {
      res.send(buildErrorResponse(res, 400, 'Identificador da tarefa é obrigatório.'));
    }
  }

  this.deleteTarefa = async function(app, req, res) {
    let db = app.config.dbConnection();
    let tarefaDAO = app.models.tarefaDAO;

    if(req.tarefa) {
      try {
        await tarefaDAO.deleteTarefa(req.tarefa.id, db);
        res.status(200);
        res.send();
      }
      catch(err) {
        res.send(buildErrorResponse(res, 500, err));
      }
      finally {
        try {
          await db.close();
        }
        catch(err) {} 
      }
    }
    else {
      res.send(buildErrorResponse(res, 400, 'Identificador da tarefa é obrigatório.'));
    }
  }

  return this;
}
