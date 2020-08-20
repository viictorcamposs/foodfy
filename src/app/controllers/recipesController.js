const recipes = require ( '../models/Recipe' )

module.exports = {
    index ( req, res ) {
        recipes.all ( ( recipes ) => {
            return res.render ( 'admin/recipes/index', { recipes } )
        })
    },
    create ( req, res ) {
        recipes.chefSelectOptions ( ( options ) => {
            return res.render ( 'admin/recipes/create', { chefOptions: options } )
        })
    },
    post ( req, res ) {
        const keys = Object.keys ( req.body )
        for ( key of keys ) {
            if ( req.body[key] == "" ) {
                return 
            }
        }
        recipes.create ( req.body, ( recipe ) => {
            return res.redirect ( `/admin/recipes/${ recipe.id }`)
        })
    },
    show ( req, res ) {
        recipes.find ( req.params.id, ( recipe ) => {
            if ( !recipe ) return res.send ( 'Recipe not found!' )
            return res.render ( 'admin/recipes/show', { recipe }) 
        })
    },
    edit ( req, res ) {
        recipes.find ( req.params.id, ( recipe ) => {
            if ( !recipe ) return res.send ( 'Recipe not found!' )
            recipes.chefSelectOptions ( ( options ) => {
                return res.render ( 'admin/recipes/edit', { recipe, chefOptions: options }) 
            })
        })
    },
    put ( req, res ) {
        const keys = Object.keys ( req.body )
        for ( key of keys ) {
            if ( req.body[key] == "" ) {
                return
            }
        }
        recipes.update ( req.body, () => {
            return res.redirect ( `/admin/recipes/${ req.body.id }` )
        })
    },
    delete ( req, res ) {
        recipes.delete ( req.body.id, () => {
            return res.redirect ( '/admin/recipes' )
        })
    }
} 