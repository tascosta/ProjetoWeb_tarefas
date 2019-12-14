module.exports = function(app) {

  let apiRouteMiddleware = function(req, res, next) {
    return app.controllers.apiController.apiRouteMiddleware(app, req, res, next);
  }

  app.get('/api/tarefas/', function(req, res) {
    res.send(app.controllers.apiController.routeError(res, 400, 'Informe o email de um usuário ou o identificador de uma tarefa.'));
  });

  app.get('/api/tarefas/:account', apiRouteMiddleware, function(req, res) {
    app.controllers.apiController.getTarefas(app, req, res);
  });

  app.get('/api/tarefa/:tarefa', apiRouteMiddleware, function(req, res) {
    app.controllers.apiController.getTarefa(app, req, res);
  });

  app.post('/api/tarefas/:account', apiRouteMiddleware, function(req, res) {
    app.controllers.apiController.criaTarefa(app, req, res);
  });

  app.put('/api/tarefas/:tarefa', apiRouteMiddleware, function(req, res) {
    app.controllers.apiController.atualizaTarefa(app, req, res);
  });

  app.delete('/api/tarefas/:tarefa', apiRouteMiddleware, function(req, res) {
    app.controllers.apiController.deleteTarefa(app, req, res);
  });
}