const Base = require('../models/Base')
const db = require('../../config/db')

Base.init({table: 'files'})

module.exports = {
    ...Base,
    async createRecipeFiles({filename, path, recipe_id}) {
        try {
            const file_id = await this.create({
                name: filename,
                path
            })
    
            const query = `
                INSERT INTO recipe_files (
                    recipe_id,
                    file_id
                ) VALUES ($1, $2)
                RETURNING id
            `
            const values = [
                recipe_id,
                file_id
            ]
            
            return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    }
}