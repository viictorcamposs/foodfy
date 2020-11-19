const express = require('express')
const routes = express.Router()

const site = require('./site')
const recipes = require('./recipe')
const chefs = require('./chef')
const users = require('./user')

routes
.use('/', site)
.use('/admin/users', users)
.use('/admin/recipes', recipes)
.use('/admin/chefs', chefs)

module.exports = routes