const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

const RecipeValidator = require('../app/validators/recipe')
const { userPermission } = require('../app/validators/user')

const recipe = require('../app/controllers/RecipeController')

routes
.get('/', onlyUsers, recipe.index)
.get('/create', onlyUsers, recipe.create)
.get('/:id', onlyUsers,  userPermission, recipe.show)
.get('/:id/edit', onlyUsers, userPermission, recipe.edit)
.put('/', onlyUsers, userPermission, multer.array('photos', 5), RecipeValidator.update, recipe.put)
.post('/', onlyUsers, multer.array('photos', 5), RecipeValidator.post, recipe.post)
.delete('/', onlyUsers, userPermission, recipe.delete)

module.exports = routes