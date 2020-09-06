const Recipes = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let results = await Recipes.all()
            const recipes = results.rows

            return res.render('admin/recipes/index', {recipes})
        } catch (error) {
            console.log(`Database Error => ${error}`)  
        }
    },
    async create(req, res) {
        try {
            let results = await Recipes.chefSelectOptions()
            const chefOptions = results.rows
    
            return res.render('admin/recipes/create', {chefOptions})
        } catch (error) {
            console.log(`Database Error => ${error}`)  
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "") return 
            }

            if(req.files.length == 0) return res.send('Por favor, envie pelo menos uma imagem da sua receita!')
            
            let results = await Recipes.create(req.body)
            const recipeId = results.rows[0].id
            
            const filePromises = req.files.map(file => File.createRecipeFiles({...file, recipe_id: recipeId}))
            await Promise.all(filePromises) 
            
            return res.redirect (`/admin/recipes/${ recipeId }`)
        } catch (error) {
            console.log(`Database Error => ${error}`)            
        }
    },
    async show(req, res) {
        try {
            let results = await Recipes.find(req.params.id)
            const recipe = results.rows[0]

            if(!recipe) return res.send('Recipe Not Found!')

            results = await File.findRecipeFiles(recipe.id)
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('admin/recipes/show', {recipe, files}) 
        } catch (error) {
            console.log(error)            
        }
    },
    async edit(req, res) {
        try {
            let results = await Recipes.find(req.params.id)
            const recipe = results.rows[0]
    
            if(!recipe) return res.send('Recipe Not Found!')
    
            results = await Recipes.chefSelectOptions()
            const chefOptions = results.rows

            results = await File.findRecipeFiles(recipe.id)
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))
            
            return res.render('admin/recipes/edit', {recipe, chefOptions, files}) 
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "" && key != "removed_files") return res.send("Por favor, preencha todos os campos!")
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.deleteRecipeFiles(id))

                await Promise.all(removedFilesPromise)
            }
            
            if(req.files.length != 0) {
                const oldFiles = await Recipes.files(req.body.id)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 6) {
                    const newFilesPromise = req.files.map(file => File.createRecipeFiles({...file, recipe_id: req.body.id}))
                    await Promise.all(newFilesPromise)
                }

            }
            
            await Recipes.update(req.body)
            
            return res.redirect (`/admin/recipes/${req.body.id}`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async delete(req, res) {
        try {
            await Recipes.delete(req.body.id)
            
            return res.redirect('/admin/recipes')
        } catch (error) {
            console.log(`Database Error => ${error}`)            
        }
    }
} 