const Recipes = require ( '../models/Recipe' )

module.exports = {
    async index ( req, res ) {
        try {
            let results = await Recipes.all()
            const recipes = results.rows
    
            return res.render ( 'admin/recipes/index', { recipes } )
        } catch (error) {
            console.log ( error )
        }
    },
    async create ( req, res ) {
        try {
            let results = await Recipes.chefSelectOptions()
            const chefOptions = results.rows
    
            return res.render ( 'admin/recipes/create', { chefOptions } )
        } catch (error) {
            console.log ( error )
        }
    },
    async post ( req, res ) {
        try {
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" ) {
                    return 
                }
            }

            let results = await Recipes.create( req.body )
            const recipeId = results.rows[0] 
            
            return res.redirect ( `/admin/recipes/${ recipeId }`)
        } catch (error) {
            console.log ( error )            
        }
    },
    async show ( req, res ) {
        try {
            let results = await Recipes.find( req.params.id )
            const recipe = results.rows[0]

            if( !recipe ) return res.send ('Recipe Not Found!')

            return res.render ( 'admin/recipes/show', { recipe }) 
        } catch (error) {
            console.log ( error )            
        }
    },
    async edit ( req, res ) {
        try {
            let results = await Recipes.find ( req.params.id )
            const recipe = results.rows[0]
    
            if ( !recipe ) return res.send ('Recipe Not Found!')
    
            results = await Recipes.chefSelectOptions()
            const chefOptions = results.rows
             
            return res.render ( 'admin/recipes/edit', { recipe, chefOptions }) 
        } catch (error) {
            console.log ( error )
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

            await Recipes.update( req.body )
            
            return res.redirect ( `/admin/recipes/${ req.body.id }` )
        } catch (error) {
            console.log ( error )
        }
    },
    async delete ( req, res ) {
        try {
            await Recipes.delete( req.body.id )
            
            return res.redirect ( '/admin/recipes' )
        } catch ( error ) {
            console.log ( error )            
        }
    }
} 