const File = require('../app/models/File')

module.exports = {
    date ( timestamp ) {
        const date = new Date ( timestamp )
        const year = date.getUTCFullYear ()
        const month = `0${date.getUTCMonth () + 1}`.slice (-2)
        const day = `0${date.getUTCDate ()}`.slice (-2)

        return {
            day,
            month,
            year, 
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}` 
        }
    },
    async getAllRecipesImage(req, recipeId) {
        let results = await File.findRecipeFiles(recipeId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`) 
    
        return files[0]
    },
    getRecipeImages(req, results) {
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return files
    },
    async getAllChefsImage(req, chefId) {
        const results = await File.findChefFile(chefId)
        const file = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`) 
        
        return file[0]
    },
    getChefImage(req, results) {
        const file = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return file
    },
}