const chefs = require ( '../models/Chef' )

module.exports = {
    index ( req, res ) {
        chefs.all ( ( chefs ) => {
            return res.render ( 'admin/chefs/index', { chefs } )
        })
    },
    create ( req, res ) {
        return res.render ( 'admin/chefs/create' )
    },
    post ( req, res ) {
        const keys = Object.keys ( req.body )
        for ( key of keys ) {
            if ( req.body[key] == "" ) {
                return 
            }
        }
        chefs.create ( req.body, ( chef ) => {
            return res.redirect ( `/admin/chefs/${ chef.id }`)
        })
    },
    show ( req, res ) {
        chefs.find ( req.params.id, ( chef ) => {
            if ( !chef ) return res.send ( 'Chef not found!' )
            chefs.findRecipe ( req.params.id, ( recipes ) => {
                return res.render ( 'admin/chefs/show', { chef, recipes }) 
            })
        })
    },
    edit ( req, res ) {
        chefs.find ( req.params.id, ( chef ) => {
            if ( !chef ) return res.send ( 'Chef not found!' )
            return res.render ( 'admin/chefs/edit', { chef })
        })
    },
    put ( req, res ) {
        const keys = Object.keys ( req.body )
        for ( key of keys ) {
            if ( req.body[key] == "" ) {
                return
            }
        }
        chefs.update ( req.body, () => {
            return res.redirect ( `/admin/chefs/${ req.body.id }` )
        })
    },
    delete ( req, res ) {
        chefs.delete ( req.body.id, () => {
            return res.redirect ( '/admin/chefs' ) 
        })
    }
} 