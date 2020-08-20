const site = require ( '../models/Site' )

module.exports = {
    index ( req, res ) {
        site.home ( ( recipes ) => {
            let { filter } = req.query 

            if ( filter ) {
                const params = {
                    filter,
                    callback ( filteredRecipes ) {
                        return res.render ( 'site/index', { recipes, filter, filteredRecipes } )
                    }
                }
                site.findby ( params )
            } else {
                return res.render ( 'site/index', { recipes } )
            }

        })
    },
    about ( req, res ) { 
        site.about ( ( data ) => {
            return res.render ( 'site/about', { items: data })        
        })
    },
    recipes ( req, res ) {
        site.all ( ( recipes ) => {
            return res.render ( 'site/recipes', { recipes })
        })
    },
    detail ( req, res ) {
        site.show ( req.params.id, ( recipe ) => {
            return res.render ( 'site/detail', { recipe })
        })
    },
    chefs ( req, res ) {
        site.allChefs ( ( chefs ) => {
            res.render ( 'site/chefs', { chefs })
        })
    }
}