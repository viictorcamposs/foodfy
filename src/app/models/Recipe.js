const { date } = require ( '../../lib/utils' )
const db = require ( '../../config/db' )

module.exports = {
    all () {
        return db.query (`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
            ORDER BY recipes.id
        `)
    },
    create ( data ) {
        const query = `
            INSERT INTO recipes (
                title,
                ingredients,
                preparations,
                information,
                chef_id,
                created_at 
            ) VALUES ($1, $2, $3, $4, $5, $6)  
            RETURNING id
        `
        const values = [
            data.title,
            data.ingredients,
            data.preparations,
            data.information,
            data.chef_id,
            date ( Date.now () ).iso
        ]
        
        return db.query ( query, values )
    },
    find ( id ) {
        return db.query (`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
            WHERE recipes.id = $1`, 
        [id])
    },
    update ( data ) {
        const query = `
            UPDATE recipes SET 
                title = ($1), 
                ingredients = ($2), 
                preparations = ($3), 
                information = ($4),
                chef_id = ($5)
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
        return db.query ( query, values )
    },
    delete ( id ) {
        return db.query (`
            DELETE FROM recipes WHERE id = $1`, 
        [id])
    },
    chefSelectOptions () {
        return db.query (`SELECT name, id FROM chefs`)
    },
    files(recipe_id) {
        return db.query(`
            SELECT files.* 
            FROM recipes 
            INNER JOIN recipe_files ON recipe_files.recipe_id = recipes.id
            INNER JOIN files ON recipe_files.file_id = files.id
            WHERE recipes.id = $1
        `,[recipe_id])
    }
}