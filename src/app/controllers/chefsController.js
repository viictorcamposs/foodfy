const Chefs = require ( '../models/Chef' )

module.exports = {
    async index ( req, res ) {
        try {
            let results = await Chefs.all()
            const chefs = results.rows
            
            return res.render ( 'admin/chefs/index', { chefs } )
        } catch (error) {
            console.log ( error )
        }
    },
    create ( req, res ) {
        return res.render ( 'admin/chefs/create' )
    },
    async post ( req, res ) {
        try {
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" ) {
                    return res.send ('Please, fill all the fields!')
                }
            }
    
            let results = await Chefs.create( req.body )
            const chef = results.rows[0]
            
            return res.redirect ( `/admin/chefs/${ chef.id }`)
        } catch (error) {
            console.log (error)
        }
    },
    async show ( req, res ) {
        try {
            let results = await Chefs.find ( req.params.id )
            const chef = results.rows[0]
    
            if ( !chef ) return res.send ('Chef Not Found!')
    
            results = await Chefs.findRecipe( req.params.id )
            const recipes = results.rows
            
            return res.render ( 'admin/chefs/show', { chef, recipes }) 
        } catch (error) {
            console.log (error)
        }
    },
    async edit ( req, res ) {
        try {
            let results = await Chefs.find( req.params.id )
            const chef = results.rows[0]
    
            if ( !chef ) return res.send ('Chef Not Found!')

            return res.render ( 'admin/chefs/edit', { chef })
        } catch (error) {
            throw new Error ( error )
        }
    },
    async put ( req, res ) {
        try {
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" ) {
                    return
                }
            }
            await Chefs.update ( req.body )

            return res.redirect ( `/admin/chefs/${ req.body.id }` )
        } catch (error) {
            console.log ( error )
        }
    },
    async delete ( req, res ) {
        await Chefs.delete ( req.body.id )

        return res.redirect ('/admin/chefs')
    }
} 