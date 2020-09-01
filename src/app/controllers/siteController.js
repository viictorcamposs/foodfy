const Site = require ( '../models/Site' )

module.exports = {
    async index ( req, res ) { 
        try {
            let results = await Site.home()
            const recipes = results.rows
            let { filter } = req.query
            if ( filter ) {
                results = await Site.findby( filter )
                const filteredRecipes = results.rows
                return res.render ('site/index', { recipes, filter, filteredRecipes })
            } else {
                return res.render ('site/index', { recipes })
            }
        } catch ( err ) {
            console.log (err)
        }
    },
    async about ( req, res ) { 
        const result = await Site.about()

        return res.render ('site/about', { result })
    },
    async recipes ( req, res ) {
        let results = await Site.all()
        const recipes = results.rows

        return res.render ( 'site/recipes', { recipes })
    },
    async detail ( req, res ) {
       let results = await Site.show( req.params.id )
       const recipe = results.rows[0] 

        return res.render ( 'site/detail', { recipe })
    },
    async chefs ( req, res ) {
        let results = await Site.allChefs()
        const chefs = results.rows

        res.render ( 'site/chefs', { chefs })
    }
}