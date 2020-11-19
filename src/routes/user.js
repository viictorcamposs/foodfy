const express = require('express')
const routes = express.Router()

const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/user')

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const { ifLoggedredirectToUsers, onlyUsers, onlyAdm } = require('../app/middlewares/session')

routes
// ROTAS PARA FAZER LOGIN E LOGOUT 
.get('/login', ifLoggedredirectToUsers, SessionController.loginForm)
.post('/login', SessionValidator.login, SessionController.login)
.post('/logout', SessionController.logout)

// ROTAS PARA RECUPERAR SENHA 
.get('/forgot-password', SessionController.forgotForm)
.get('/reset-password', SessionController.resetForm)
.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
.post('/reset-password',  SessionValidator.reset, SessionController.reset)

// ROTAS QUE TODOS OS USUÁRIOS PODEM ACESSAR
.get('/profile', onlyUsers, ProfileController.index)
.put('/profile', UserValidator.update, ProfileController.put)

// ROTA PARA O ADMIN VISUALIZAR LISTA DOS USUÁRIOS CADASTRADOS
.get('/', onlyUsers, onlyAdm, UserController.index)

// ROTAS PARA CRIAR USUÁRIOS
.get('/register', onlyUsers, onlyAdm, UserController.register)
.post('/register', UserValidator.post, UserController.post)

// ROTAS PARA O ADMIN ATUALIZAR OUTROS USUÁRIOS
.get('/:id', onlyUsers, onlyAdm, UserController.edit)
.put('/', UserValidator.update, UserController.put)

// ROTA PARA DELETAR USUÁRIOS
.delete('/', UserValidator.remove, UserController.delete)


module.exports = routes