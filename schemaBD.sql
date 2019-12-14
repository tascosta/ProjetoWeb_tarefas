create database tarefa;

USE tarefa;


  CREATE TABLE `usuarios` (`id` INT NOT NULL AUTO_INCREMENT,  
  `email` VARCHAR(150) NOT NULL, 
  `senha` VARCHAR(50) NOT NULL, timestamp TIMESTAMP,   PRIMARY KEY (`id`)); 
  
  
  create table tarefa (`id` INT NOT NULL AUTO_INCREMENT,
	`id_usuario` int NOT NULL,
	`progresso` int NOT NULL default 0,
  `descricao` varchar(100) NOT NULL,timestamp TIMESTAMP,   PRIMARY KEY (`id`)); 
    
	SELECT * FROM tarefa;
  SELECT * FROM usuarios;

 
    
