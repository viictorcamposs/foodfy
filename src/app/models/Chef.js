const db = require('../../config/db')
const Base = require('../models/Base')

Base.init({table: 'chefs'})

module.exports = {
    ...Base,
    async files(chefId) { 
        const results = await db.query(`
            SELECT files.*
            FROM chefs
            LEFT JOIN files ON (chefs.file_id = files.id)
            WHERE chefs.id = $1
        `, [chefId])

        return results.rows
    }
}