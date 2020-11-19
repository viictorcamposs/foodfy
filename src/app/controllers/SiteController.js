const Site = require('../models/Site')

const LoadService = require('../services/LoadServices')

module.exports = {
    async index(req, res) { 
        try {
            // PEGAR RECEITAS
            const recipes = await LoadService.load('recipes')

            return res.render('site/pages/home', { recipes })
        } catch ( error ) {
            console.error(error)
        }
    },
    async about(req, res) { 
        const result = await Site.about()

        return res.render ('site/pages/about', { result })
    },
    async recipes(req, res) {
        try {
            // PEGAR RECEITAS
            const recipes = await LoadService.load('recipes')

            return res.render('site/pages/recipes', { recipes })
        } catch (error) {
            console.log(`Datbase Error => ${error}`)
        }
    },
    async detail(req, res) {
        try {
            // PEGAR RECEITA
            const recipe = await LoadService.load('recipe', {
                where: { id: req.params.id }
            })
     
             return res.render ( 'site/pages/detail', { recipe })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async chefs(req, res) {
        try {
            // PEGAR CHEFS
            let chefs = await LoadService.load('chefs')

            // PEGAR TOTAL DE RECEITAS DE CADA CHEF
            const chefsPromise = chefs.map(async chef => 
                chef = {
                    ...chef,
                    recipes: await LoadService.load('recipes', {
                        where: { chef_id: chef.id }
                    }) 
                }    
            )
            chefs = await Promise.all(chefsPromise)
    
            return res.render('site/pages/chefs', { chefs })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async search(req, res) {
        try {
            const { filter } = req.query
            if(!filter) return res.redirect('/')

            let results = await Site.search(filter)
            const RecipesPromise = results.rows.map(async recipe => 
                await LoadService.load('recipe', {
                    where: { id: recipe.id }
                })
            )
            const recipes = await Promise.all(RecipesPromise)

            return res.render('site/search/index', {filter, recipes})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}