const { getAllRecipesImage, getRecipeImages } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

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

            return res.render('admin/recipes/index', {recipes: results})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async create(req, res) {
        try {
            let results = await Recipe.chefSelectOptions()
            const chefOptions = results.rows

            return res.render ('admin/recipes/create', {chefOptions})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "") return res.send('Please, fill all the fields!')
            }

            if(req.files.length == 0) return res.send('Please, send at least one image!')

            let results = await Recipe.create(req.body)
            const recipeId = results.rows[0].id

            const FilesPromise = req.files.map(file => File.createRecipeFiles({...file, recipe_id: recipeId}))
            await Promise.all(FilesPromise)

            return res.redirect(`/admin/recipes/${recipeId}`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            if(!recipe) return res.send('Recipe Not Found!')

            results = await File.findRecipeFiles(recipe.id)
            const files = await getRecipeImages(req, results)

            return res.render('admin/recipes/show', {recipe, files})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            if(!recipe) return res.send('Recipe Not Found!')

            results = await Recipe.chefSelectOptions()
            const chefOptions = results.rows

            results = await File.findRecipeFiles(recipe.id)
            const files = await getRecipeImages(req, results)

            return res.render('admin/recipes/edit', {recipe, chefOptions, files})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "" && key != 'removed_files') return res.send('Please, fill all the fields!')
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.deleteRecipeFiles(id))
                await Promise.all(removedFilesPromise)
            }

            if(req.files.length != 0) {
                const oldFiles = await File.findRecipeFiles(req.body.id)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 5) {
                    const newFilesPromise = req.files.map(file => File.createRecipeFiles({...file, recipe_id: req.body.id}))
                    await Promise.all(newFilesPromise)
                }
            }

            await Recipe.update(req.body)

            return res.redirect(`/admin/recipes/${req.body.id}`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id)

            return res.redirect('/admin/recipes')
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}