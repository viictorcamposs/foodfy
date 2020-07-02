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
  return res.render ('home', { data })
})

// CONFIGURANDO CAMINHO ABOUT.NJK
server.get ('/about', function (req, res) {
  const dataPage = [
    {
      class: "sobre",
      title: "Sobre o Foodfy",
      paragraph: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
      paragraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod."
    },
    {
      class: "historia",
      title: "Como tudo começou...",
      paragraph: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
      paragraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod."
    },
    {
      class: "receitas",
      title: "Nossas receitas",
      paragraph: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod.",
      paragraph2: ""
    }
  ]
  return res.render ('about', { items: dataPage })
})

// CONFIGURANDO CAMINHO RECIPES.NJK
server.get ('/recipes', function (req, res) {
  return res.render ('recipes', { data })
})

// CONFIGURANDO CAMINHO DETAIL.NJK
server.get ('/recipes/detail/:id', function (req, res) {
  const id = req.params.id
  const recipe = data.find (function (recipe) {
    return recipe.id == id
  })

  if ( !recipe ) {
    return res.status (404).render ('not-found')
  }
  return res.render ('detail', { item: recipe })
})


server.listen (5500, () => {
  console.log ('Server is running')
})