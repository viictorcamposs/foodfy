const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    getAllRecipes() {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            ORDER BY created_at DESC
        `)
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                title, 
                ingredients,
                preparations, 
                information,
                chef_id,
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `
        const values = [
            data.title,
            data.ingredients,
            data.preparations,
            data.information,
            data.chef_id,
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            WHERE recipes.id = $1
        `, [id])
    },
    update(data) {
        const query = `
            UPDATE recipes SET
                title = $1,
                ingredients = $2,
                preparations = $3, 
                information = $4,
                chef_id = $5
            WHERE id = $6
        `
        const values = [
            data.title,
            data.ingredients,
            data.preparations,
            data.information,
            data.chef_id,
            data.id
        ]
        return db.query(query, values)
    },
    async delete(recipeId) {
        let results = await db.query(`
            SELECT * FROM recipe_files
            WHERE recipe_files.recipe_id = $1
        `, [recipeId])
        const recipeFiles = results.rows
        const recipeFilesPromise = recipeFiles.map(async recipe_file => {
            let results = await db.query(`
                SELECT files.*
                FROM recipe_files
                LEFT JOIN files ON recipe_files.file_id = files.id
                WHERE recipe_files.id = $1
            `, [recipe_file.id])
            const file = results.rows[0]

            await db.query(`DELETE FROM recipe_files WHERE id = $1`, [recipe_file.id])

            fs.unlinkSync(file.path)

            await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
        })
        await Promise.all(recipeFilesPromise)

        return db.query(`
            DELETE FROM recipes WHERE id = $1
        `, [recipeId])
    },
    chefSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    }
}