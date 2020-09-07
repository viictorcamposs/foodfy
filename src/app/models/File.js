const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async createRecipeFiles({filename, path, recipe_id}) {
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
            const results = await db.query(query, values)
            const fileId = results.rows[0].id

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
            console.log(`Datbase Error => ${error}`)
        }
    },
    findRecipeFiles(recipeId) {
        try {
            return db.query(`
                SELECT files.* FROM recipes
                INNER JOIN recipe_files ON recipe_files.recipe_id = recipes.id
                INNER JOIN files ON files.id = recipe_files.file_id
                WHERE recipes.id = $1
            `, [recipeId])
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }   
    },
    async deleteRecipeFiles(id) {
        try {
            const results = await db.query(`
                SELECT * FROM files
                WHERE id = $1
            `, [id])
            const file = results.rows[0]

            await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id])

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async createChefFile({filename, path}) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2) 
            RETURNING id
        `
        const values = [
            filename,
            path
        ]
        
        return db.query(query, values)
    },
    findChefFile(chefId) {
        try {
            return db.query(`
                SELECT files.* FROM chefs
                LEFT JOIN files ON chefs.file_id = files.id
                WHERE chefs.id = $1
            `, [chefId])
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    deleteChefFile(fileId) {
        return db.query(`
            DELETE FROM files WHERE id = $1
        `, [fileId])
    }
}