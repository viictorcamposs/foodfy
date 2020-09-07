const { date, getAllRecipesImage, getRecipeImages, getAllChefsImage } = require('../../lib/utils')
const Site = require('../models/Site')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) { 
        try {
            let results = await Recipe.getAllRecipes()
            const recipes = results.rows

            if(!recipes) return res.send('Recipes Not Found!')

            const RecipesPromise = recipes.map(async recipe => {
                recipe.img = await getAllRecipesImage(req, recipe.id)
                return recipe
            })
            results = await Promise.all(RecipesPromise)

            return res.render('site/pages/home', {recipes: results})

        } catch ( error ) {
            console.log (`Database Error => ${error}`)
        }
    },
    async about(req, res) { 
        const result = await Site.about()

        return res.render ('site/pages/about', { result })
    },
    async recipes(req, res) {
        try {
            let results = await Recipe.getAllRecipes()
            const recipes = results.rows
    
            if(!recipes) return res.send('Recipes Not Found!')
    
            const RecipesPromise = recipes.map(async recipe => {
                recipe.img = await getAllRecipesImage(req, recipe.id)
                return recipe
            })
            results = await Promise.all(RecipesPromise)
    
            return res.render('site/pages/recipes', {recipes: results})
        } catch (error) {
            console.log(`Datbase Error => ${error}`)
        }
    },
    async detail(req, res) {
        try {
            let results = await Site.show( req.params.id )
            const recipe = results.rows[0] 
     
            if(!recipe) return res.send('Recipe Not Found!')
     
            results = await File.findRecipeFiles(recipe.id)
            const files = await getRecipeImages(req, results)
     
             return res.render ( 'site/pages/detail', { recipe, files })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async chefs(req, res) {
        try {
            let results = await Site.allChefs()
            const chefs = results.rows
    
            if(!chefs) return res.send ('Chefs Not Found!')
    
            const ChefsPromise = chefs.map(async chef => {
                chef.img = await getAllChefsImage(req, chef.id)
    
                return chef
            })
            results = await Promise.all(ChefsPromise)
    
            return res.render('site/pages/chefs', {chefs: results})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async search(req, res) {
        try {
            const { filter } = req.query
            if(!filter) return res.redirect('/')

            let results = await Site.search(filter)
            const RecipesPromise = results.rows.map(async recipe => {
                recipe.img = await getAllRecipesImage(req, recipe.id)

                return recipe
            })
            const recipes = await Promise.all(RecipesPromise)

            return res.render('site/search/index', {filter, recipes})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}