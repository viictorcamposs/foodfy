const express = require('express')
const routes = express.Router()

const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/recipesController')
const chefs = require('./app/controllers/chefsController')
const site = require('./app/controllers/siteController')

routes
// ROTAS DA ÁREA ADMINISTRATIVA RECEITAS
.get('/admin/recipes', recipes.index)
.get('/admin/recipes/create', recipes.create)
.get('/admin/recipes/:id', recipes.show)
.get('/admin/recipes/:id/edit', recipes.edit)
.put('/admin/recipes', multer.array('photos', 5), recipes.put) 
.post('/admin/recipes', multer.array('photos', 5), recipes.post)
.delete('/admin/recipes', recipes.delete)

// ROTAS DA ÁREA ADMINISTRATIVA CHEF
.get('/admin/chefs', chefs.index)
.get('/admin/chefs/create', chefs.create)
.get('/admin/chefs/:id', chefs.show)
.get('/admin/chefs/:id/edit', chefs.edit)
.put('/admin/chefs', multer.single('photo'),chefs.put) 
.post('/admin/chefs', multer.single('photo'),chefs.post)
.delete('/admin/chefs', chefs.delete)


// ROTAS DO SITE FOODFY
.get('/', site.index)
.get('/about', site.about)
.get('/recipes', site.recipes)
.get('/recipes/:id', site.detail)
.get('/chefs', site.chefs)

module.exports = routes