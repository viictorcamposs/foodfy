const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { onlyUsers, onlyAdm } = require('../app/middlewares/session')

const validator = require('../app/validators/chef')

const chef = require('../app/controllers/ChefController')

routes
.get('/', onlyUsers, chef.index)
.get('/create', onlyUsers, onlyAdm, chef.create)
.get('/:id', onlyUsers, chef.show)
.get('/:id/edit', onlyUsers, onlyAdm, chef.edit)
.post('/', onlyUsers, onlyAdm, multer.single('photo'), validator.post, chef.post)
.put('/', onlyUsers, onlyAdm, multer.single('photo'), validator.update, chef.put)
.delete('/', onlyUsers, onlyAdm, chef.delete)

module.exports = routes