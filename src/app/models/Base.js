const db = require('../../config/db')

// FUNÇÃO PARA SELECIONAR UM DADO DE UMA TABELA DO BANCO DE DADOS DE FORMA DINÂMICA
function find(filters, table) {
    let query = `SELECT * FROM ${table}`

    if(filters) { 
        Object.keys(filters).map(key => {
            query += ` ${key}`  
            Object.keys(filters[key]).map(field => { 
                query += ` ${field} = '${filters[key][field]}'` 
            })
        })
    }

    return db.query(query)
}

module.exports = {
    init({table}) {
        if(!table) throw new Error('404!Invalid Params!')

        this.table = table
        return this
    },
    async find(id) {
        try {
            // FAZER REQUISIÇÃO NO BANCO DE DADOS
            const results = await find({where: { id }}, this.table)
  
            // RETORNAR VALOR
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async findOne(filters) {
        try {
            const results = await find(filters, this.table)

            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async findAll(filters) {
        try {
            // ENCONTRAR VALORES DA TABELA NO BANCO DE DADOS 
            const results = await find(filters, this.table)

            // RETORNAR UM CONJUNTO DE DADOS SELECIONADOS NO BANCO DE DADOS
            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async create(fields) { 
        try {
            // PEGAR DADOS E VALORES PARA ENVIAR PARA O BANCO DE DADOS
            const columns = Object.keys(fields).join(',')
            const values = Object.keys(fields).map(key => `'${fields[key]}'`).join(',')

            // CRIAR ESTRUTURA DE INSERÇÃO DE VALORES NO BANCO DE DADOS
            const query = `
                INSERT INTO ${this.table}
                (${columns})
                VALUES (${values})
                RETURNING id
            `

            // CRIAR E RETORNAR id DE UM ELEMENTO DA TABELA 
            const results = await db.query(query)
            return results.rows[0].id
        } catch (error) {
            console.error(error)
        }
    },
    async update(id, fields) {
        // PEGAR DADOS E VALORES PARA ATUALIZAR NO BANCO DE DADOS
        const setFields = Object.entries(fields)
        .map(([field, value]) => `${field} = '${value}'`)

        // CRIAR QUERY
        const query = `
            UPDATE ${this.table} SET
            ${setFields.join(',')}
            WHERE id = ${id}
        `

        // RETORNAR OBJETO ATUALIZADO
        const results = await db.query(query)
        return results.rows[0]
    },
    async delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
    }
}