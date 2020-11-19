const { unlinkSync } = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')

const LoadService = require('../services/LoadServices')

module.exports = {
    async index(req, res) {
        // PEGAR CHEFS
        const chefs = await LoadService.load('chefs')

        return res.render('admin/chefs/index', { chefs })
    },
    create(req, res) {
        // DIRECIONAR PARA PÁGINA DE CRIAÇÃO DE CHEF
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        try {
            // PEGAR DADOS DO CHEF ENVIADOS PELO USUÁRIO
            const { name } = req.body
    
            // CRIAR FOTO DO CHEF E PEGAR O ID DO ARQUIVO
            const file_id = await File.create({
                name: req.file.filename, 
                path: req.file.path
            })
    
            // CRIAR CHEF
            const chef_id = await Chef.create({
                name,
                file_id
            })
    
            // REDIRECIONAR PARA PÁGINA DO CHEF CRIADO
            return res.redirect(`/admin/chefs/${chef_id}`)
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/create', {
                error: 'Não foi possível cadastrar chef. Tente novamente.'
            })
        }
    },
    async show(req, res) {
        try {
            // PEGAR ID DO CHEF
            const { id } = req.params

            // PEGAR CHEF
            const chef = await LoadService.load('chef', {
                where: { id }
            })

            // PEGAR RECEITAS DO CHEF
            const recipes = await LoadService.load('recipes', {
                where: { chef_id: id }
            })

            return res.render('admin/chefs/show', { chef, recipes })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            // PEGAR ID DO CHEF
            const { id } = req.params
    
            // PEGAR CHEF
            const chef = await LoadService.load('chef', {
                where: { id }
            })

            // PEGAR RECEITAS DO CHEF
            const recipes = await LoadService.load('recipes', {
                where: { chef_id: id }
            })
    
            return res.render('admin/chefs/edit', { chef, recipes })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            const { name, id } = req.body
    
            let file_id
            if(req.file != 0) {
                file_id = await File.create({
                    name: req.file.filename, 
                    path: req.file.path
                })
            }

            await Chef.update( id, { 
                name, 
                file_id 
            })
            
            return res.redirect(`/admin/chefs/${id}`)
        } catch (error) {
            console.error(error)
        }      
    },
    async delete(req, res) {
        try {
            // PEGAR id DO CHEF
            const { id } = req.body

            // PEGAR  E DELETAR IMAGEM
            let file = await Chef.files(id)
            unlinkSync(file[0].path)
            await File.delete(file[0].id)
    
            // DELETAR CHEF
            await Chef.delete(id)
            
            // REDIRECIONAR PARA PÁGINA DE LISTA DOS CHEFS
            return res.redirect('/admin/chefs')
        } catch (error) {
            console.error(error)
            return res.render('admin/chefs/edit', {
                error: 'Não foi possível deletar chef. Tente novamente mais tarde.'
            })
        }
    }
}