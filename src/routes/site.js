const express = require('express')
const routes = express.Router()

const SiteController = require('../app/controllers/SiteController')

routes
.get('/', SiteController.index)
.get('/search', SiteController.search)
.get('/about', SiteController.about)
.get('/recipes', SiteController.recipes)
.get('/recipes/:id', SiteController.detail)
.get('/chefs', SiteController.chefs)

module.exports = routes