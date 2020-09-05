const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async createRecipeFiles ({filename, path, recipe_id}) {
        try {
            let query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            ` 
            let values = [
                filename,
                path
            ]
            const result = await db.query(query, values)
            const fileId = result.rows[0].id
            query = `
                INSERT INTO recipe_files (
                    recipe_id,
                    file_id
                ) VALUES ($1, $2) 
                RETURNING id
            `
            values = [
                recipe_id,
                fileId
            ]
    
            return db.query(query, values) 
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    showRecipeFiles(recipe_id) {
        try {
            const query = `
                SELECT files.*
                FROM recipes
                INNER JOIN recipe_files ON recipes.id = recipe_files.recipe_id
                INNER JOIN files ON files.id = recipe_files.file_id
                WHERE recipe_files.recipe_id = $1
            `
            const values = [
                recipe_id
            ]
            return db.query(query, values)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async deleteRecipeFiles(id) {
        try {
            // pra fazer o delete das imagens, eu pego primeiro o file_id e busco o id do recipe_file, removo primeiro ele e depois o file

            let results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = results.rows[0]
            
            results = await db.query(`
                SELECT recipe_files.id 
                FROM recipe_files 
                LEFT JOIN files ON recipe_files.file_id = files.id
                WHERE files.id = $1
            `, [id])
            const recipe_fileId = results.rows[0].id

            await db.query(`DELETE FROM recipe_files WHERE id = $1`, [recipe_fileId])

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])

        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}