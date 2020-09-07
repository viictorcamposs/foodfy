const { date } = require('../../lib/utils')
const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    getAllChefs() {
        return db.query(`
            SELECT chefs.* FROM chefs
        `)
    },
    create(data, fileId) {
        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3) 
            RETURNING id
        `
        const values = [
            data.name,
            date(Date.now()).iso,
            fileId
        ]
        
        return db.query(query, values)
    },
    find(id) {
        return db.query (`
            SELECT chefs.*,
            count ( recipes ) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON ( recipes.chef_id = chefs.id )
            WHERE chefs.id = $1
            GROUP BY chefs.id`
        , [id])      
    },
    findRecipes(chefId) {
        return db.query(`
            SELECT recipes.* FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            WHERE chefs.id = $1
            ORDER BY updated_at DESC
        `, [chefId])
    },
    update(data, fileId) {
        const query = `
            UPDATE chefs SET
                name = $1,
                file_id = $2
            WHERE id = $3
        `
        const values = [
            data.name,
            fileId,
            data.id
        ]
        return db.query(query, values)
    },
    async delete(id) {
        const result = await db.query(`
            SELECT files.* FROM files 
            LEFT JOIN chefs ON chefs.file_id = files.id
            WHERE chefs.id = $1
        `, [id])
        const file = result.rows[0]

        fs.unlinkSync(file.path)

        await db.query (`
            DELETE FROM chefs
            WHERE id = $1`
        , [id])
        
        return db.query(`DELETE FROM files WHERE id =$1`, [file.id])
    }
}