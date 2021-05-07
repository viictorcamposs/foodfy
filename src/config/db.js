const { Pool } = require('pg')

module.exports = new Pool({
    user: '', // ALTERE ESSA LINHA
    password: '', // ALTERE ESSA LINHA
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})