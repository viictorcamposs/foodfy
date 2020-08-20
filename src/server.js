const nunjucks = require ('nunjucks')
const express = require ('express')
const routes = require ('./routes')
const server = express ()
const methodOverride = require ('method-override')

server
.use ( express.urlencoded ( {extended: true } ))
.use ( express.static ( 'public/styles' ))
.use ( express.static ( 'public/scripts' ))
.use ( express.static ( 'public/assets' ))
.use ( methodOverride ( '_method' ))
.use ( routes )
.set ( 'view engine', 'njk' )

nunjucks.configure ( 'src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen ( 5000, () => {
    console.log ( 'Server is running' )
})