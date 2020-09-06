const Chefs = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let results = await Chefs.all()
            const chefs = results.rows

            let ChefsArray = []
            for (let chef of chefs) {
                results = await File.findChefFile(chef.id)
                const result = results.rows[0]

                const Chef = {
                    ...result,
                    src: `${req.protocol}://${req.headers.host}${result.path.replace('public', '')}`
                }
                ChefsArray.push(Chef)
            }
            
            return res.render('admin/chefs/index', {chefs: ChefsArray})
        } catch (error) {
            console.log(`Database Error => ${error}`) 
        }
    },
    create(req, res) {
        return res.render ( 'admin/chefs/create' )
    },
    async post(req, res) {
        try {
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" ) return res.send ('Por favor, preencha todos os campos!')
            }

            if(req.file == 0) return res.send('Por favor, envie uma imagem para ser sua foto de perfil!')
            
            let results = await File.createChefFile({...req.file})
            const fileId = results.rows[0].id
            
            results = await Chefs.create(req.body, fileId)    
            const chefId = results.rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)
        } catch (error) {
            console.log (`Database Error => ${error}`)
        }
    },
    async show(req, res) {  
        try {
            let results = await Chefs.find(req.params.id) 
            const chef = results.rows[0]
    
            if ( !chef ) return res.send('Chef Not Found!')

            results = await File.findChefFile(req.params.id)
            let file = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))
    
            results = await Chefs.findRecipe(req.params.id)
            const recipes = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))
            
            return res.render('admin/chefs/show', {chef, recipes, file}) 
        } catch (error) {
            console.log (`Database Error => ${error}`)
        }
    },
    async edit(req, res) {
        try {
            let results = await Chefs.find( req.params.id )
            const chef = results.rows[0]
    
            if ( !chef ) return res.send ('Chef Not Found!')

            return res.render ( 'admin/chefs/edit', { chef })
        } catch (error) {
            console.log(`Database Error => ${error}`) 
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" ) return res.send('Por favor, preencha todos os campos!')
            }

            let fileId = []
            if(req.file != 0) {
                const results = await File.createChefFile({...req.file})
                fileId.push(results.rows[0].id) 
            }

            await Chefs.update ( req.body, fileId[0] )

            return res.redirect ( `/admin/chefs/${ req.body.id }` )
        } catch (error) {
            console.log(`Database Error => ${error}`) 
        }
    },
    async delete(req, res) {
        await Chefs.delete ( req.body.id )

        return res.redirect ('/admin/chefs')
    }
} 