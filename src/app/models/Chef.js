const { date } = require ( '../../lib/utils' )
const db = require ( '../../config/db' )

module.exports = { 
    all () {
        return db.query (`
            SELECT chefs.*  
            FROM chefs
        `)
    },
    create ( data, file_id ) {
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
            date ( Date.now () ).iso,
            file_id
        ]

        return db.query ( query, values )
    },
    find ( id ) {
        return db.query (`
            SELECT chefs.*,
            count ( recipes ) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON ( recipes.chef_id = chefs.id )
            WHERE chefs.id = $1
            GROUP BY chefs.id`
        , [id])
    },
    findRecipe ( id ) {
        return db.query (`
            SELECT chefs.name, recipes.title, recipes.id, recipe_files.file_id, files.path 
            FROM chefs
            INNER JOIN recipes ON recipes.chef_id = chefs.id
            INNER JOIN recipe_files ON recipe_files.recipe_id = recipes.id
            INNER JOIN files ON recipe_files.file_id = files.id
            WHERE chefs.id = $1`
        , [id])
    },
    update ( data, file_id ) {
        const query = `
            UPDATE chefs SET 
                name = ($1),
                file_id = ($2) 
            WHERE id = $3
        `
        const values = [
            data.name,
            file_id,
            data.id
        ]
        return db.query ( query, values )
    },
    delete ( id ) {
        return db.query (`
            DELETE FROM chefs
            WHERE id = $1`
        , [id])
    }
}