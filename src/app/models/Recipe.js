const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'recipes'})

module.exports = {
    ...Base,
    async files(recipeId) {
        const results = await db.query(`
            SELECT files.*
            FROM recipes
            INNER JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            INNER JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipes.id = $1
        `, [recipeId])

        return results.rows
    }
}