const nunjucks = require ('nunjucks')
const express = require ('express')
const data = require ('./data')
const server = express () 

server.use (express.static ('public/assets'))
server.use (express.static ('public/styles'))
server.use (express.static ('public/scripts'))

server.set ('view engine', 'njk')

nunjucks.configure ('views', {
  express: server,
  autoescape: false,
  noCache: true
})

// CONFIGURANDO CAMINHO DA HOME.NJK
server.get ('/', function (req, res) {
  return res.render ('home')
})

// CONFIGURANDO CAMINHO ABOUT.NJK
server.get ('/about', function (req, res) {
  return res.render ('about')
})

// CONFIGURANDO CAMINHO RECIPES.NJK
server.get ('/recipes', function (req, res) {
  return res.render ('recipes')
})


server.listen (5500, () => {
  console.log ('Server is running')
})