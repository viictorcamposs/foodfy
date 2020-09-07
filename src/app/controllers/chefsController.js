const { getAllRecipesImage, getAllChefsImage, getChefImage } = require('../../lib/utils')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let results = await Chef.getAllChefs()
            const chefs = results.rows

            if(!chefs) return res.send ('Chefs Not Found!')

            const ChefsPromise = chefs.map(async chef => {
                chef.img = await getAllChefsImage(req, chef.id)

                return chef
            })
            results = await Promise.all(ChefsPromise)

            return res.render('admin/chefs/index', {chefs: results})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "") return res.send('Please, fill all the fields!')
            }

            if(req.file == 0) return res.send('Please, send at least one image')

            let results = await File.createChefFile({...req.file})
            const fileId = results.rows[0].id

            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async show(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) return res.send('Chef Not Found!')

            results = await File.findChefFile(chef.id)
            const file = await getChefImage(req, results)

            results = await Chef.findRecipes(req.params.id)
            let recipes = results.rows



            const RecipesPromise = recipes.map(async recipe => {
                recipe.img = await getAllRecipesImage(req, recipe.id)

                return recipe
            })
            recipes = await Promise.all(RecipesPromise)

            return res.render('admin/chefs/show', {chef, file, recipes})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async edit(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if(!chef) return res.send('Chef Not Found!')

            return res.render('admin/chefs/edit', {chef})
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "") return res.send('Please, fill all the fields!')
            }

            let fileId
            if(req.file != 0) {
                const result = await File.createChefFile({...req.file})
                fileId = result.rows[0].id
            }

            await Chef.update(req.body, fileId)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }
} 