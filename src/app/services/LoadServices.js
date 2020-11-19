const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

// PEGAR IMAGENS NO BANCO DE DADOS 
async function getImages(func, elementId) {
    let files = await func.files(elementId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace('public', '')}`
    }))

    return files
}
async function format(func, element) {
    const files = await getImages(func, element.id)
    element.img = files[0].src
    element.files = files

    return element
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async recipe() {
        try {
            let recipe = await Recipe.findOne(this.filter)
            recipe = await format(Recipe, recipe)

            return recipe = {
                ...recipe,
                chef: await Chef.find(recipe.chef_id)
            }
        } catch (error) {
            console.error(error)
        }
    },
    async recipes() {
        try {
            let recipes = await Recipe.findAll(this.filter)
            let recipesPromise = recipes.map(element => 
                format(Recipe, element)
            )
            
            recipes = await Promise.all(recipesPromise)
            recipesPromise = recipes.map(async recipe => 
                recipe = {
                    ...recipe,
                    chef: await Chef.find(recipe.chef_id)
                }    
            )
            
            return Promise.all(recipesPromise)
        } catch (error) {
            console.error(error)
        }
    },
    async chef() {
        try {
            let chef = await Chef.findOne(this.filter)
            
            return format(Chef, chef)
        } catch (error) {
            console.error(error)
        } 
    },
    async chefs() {
        try {
            let chefs = await Chef.findAll()
            let chefsPromise = chefs.map(element => 
                format(Chef, element)
            )
            
            return Promise.all(chefsPromise)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = LoadService