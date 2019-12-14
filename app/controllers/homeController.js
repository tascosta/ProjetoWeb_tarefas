module.exports = function () {

  this.getTarefas = async function(app, req, res) {

    let db = app.config.dbConnection();
    let tarefaModel = app.models.tarefaModel;

    let tarefasBacklog = [];
    let tarefasEmAndamento = [];
    let tarefasConcluidas = [];
    let erro = null;

    try{
      tarefasBacklog = await tarefaModel.getTarefasBacklog(1, db);
      tarefasEmAndamento = await tarefaModel.getTarefasEmAndamento(1, db);
      tarefasConcluidas = await tarefaModel.getTarefasConcluidas(1, db);
    }
    catch (err) {
      console.log(err);
      erro = err;
    }
    finally {
      try {
        await db.close();
      }
      catch(err) {}
    }

    res.render('home', {
      tarefas: {
        backlog: tarefasBacklog,
        emAndamento: tarefasEmAndamento,
        concluidas: tarefasConcluidas
      },
      erro: erro
    });
  }

  this.deletarTarefa = async function(app, req, res) {

    const db = app.config.dbConnection();
    let tarefaModel = app.models.tarefaModel;
    let idTarefa = req.query.id;

    try{
      if(idTarefa)
        await tarefaModel.deleteTarefa(idTarefa, db);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      try {
        await db.close();
      }
      catch(err) {}
    }

    res.redirect('/home');
  }

  this.criarTarefa = async function(app, req, res) {
    const db = app.config.dbConnection();
    let tarefaModel = app.models.tarefaModel;

    try {
      let tarefa = req.body;
      tarefa.id_usuario = 1;

      if(tarefa.id)
        await tarefaModel.atualizarTarefa(tarefa, db);
      else
        await tarefaModel.inserirTarefa(tarefa, db);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      try {
        await db.close();
      }
      catch(err) {}
    }

    res.redirect('/home');
  }

  this.atualizarProgressoTarefa = async function(app, req, res) {
    const db = app.config.dbConnection();
    let tarefaModel = app.models.tarefaModel;

    let tarefa = req.body;

    try {
      await tarefaModel.atualizarProgressoTarefa(tarefa, db);
      tarefa = await tarefaModel.getTarefa(tarefa.id, db);

      if(tarefa.progresso == 100) {
        let emailDestino = process.env.EMAIL_NOTIFICACAO;
        
        if(emailDestino)
          app.config.emailSender.send(
            emailDestino, 
            `Tarefa "${tarefa.descricao}" finalizada com sucesso.`, 
            `A tarefa "${tarefa.descricao}" foi finalizada com sucesso em ${new Date()}.`
          );
        else
          console.log('Email não enviado. EMAIL_NOTIFICACAO é nulo.');
      }
    }
    catch (err) {
      console.log(err);
    }
    finally {
      try {
        await db.close();
      }
      catch(err) {}
    }

    if(req.device.type.toUpperCase() === 'PHONE')
      res.redirect(`/home#${tarefa.id}`);
    else
      res.redirect(`/home`);
  }

  return this;
}
