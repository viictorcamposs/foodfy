const { Pool } = require ( 'pg' )

module.exports = new Pool ({
    user: 'postgres', // ALTERE ESSA LINHA
    password: '12345', // ALTERE ESSA LINHA
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})