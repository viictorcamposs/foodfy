const { unlinkSync } = require('fs')

const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')

const LoadService = require('../services/LoadServices')

module.exports = {
    async index(req, res) {
        try {
            // PEGAR id DO USUÁRIO QUE ESTÁ LOGADO
            const { userId: id } = req.session

            // PEGAR RECEITAS
            const recipes = await LoadService.load('recipes', {
                where: { user_id: id } 
            })

            // DIRECIONAR PARA PÁGINA DE RECEITAS DO USUÁRIO
            return res.render('admin/recipes/index', { recipes })
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        try { 
            // PEGAR CHEFS PARA MANDAR COMO OPÇÕES PARA PÁGINA DE CRIAÇÃO DE RECEITA
            const chefOptions = await Chef.findAll()

            // DIRECIONAR PÁGINA DE CRIAÇÃO DE RECEITA ENVIANDO TODOS OS CHEFS
            return res.render('admin/recipes/create', { chefOptions })
        } catch (error) {
            console.error(error)
        }
        return res.render('admin/recipes/create')
    },
    async post(req, res) {
        try {
            // PEGAR id DO USUÁRIO QUE ESTÁ LOGADO 
            const { userId: user_id } = req.session

            // PEGAR TODOS OS DADOS DA RECEITA QUE SÃO ENVIADOS PELO USUÁRIO
            const { title, chef_id, ingredients, preparations, information } = req.body

            // ENVIAR DADOS DA RECEITA PARA INSERIR NO BANCO DE DADOS
            const recipe_id = await Recipe.create({
                title,
                ingredients: `{${ingredients}}`,
                preparations: `{${preparations}}`,
                information,
                chef_id,
                user_id
            })
    
            // ENVIAR FOTOS SELECIONADAS PELO USUÁRIO PARA O BANCO DE DADOS
            const filesPromise = req.files.map(file => {
                File.createRecipeFiles({...file, recipe_id}) 
            })
            await Promise.all(filesPromise)
    
            // REDIRECIONAR PARA PÁGINA DA RECEITA CRIADA
            return res.redirect(`/admin/recipes/${recipe_id}`)
        } catch (error) {
            console.error(error)
            // CASO OCORRA ALGUM ERRO NA CRIAÇÃO, ENVIAR MENSAGEM PARA O USUÁRIO
            return res.render('admin/recipes/create', {
                error: 'Não foi possível criar receita! Tente novamente.'
            })
        }
    },
    async show(req, res) {
        try {
            // PEGAR ID DA RECEITA
            const { id } = req.params

            // PEGAR RECEITA
            const recipe = await LoadService.load('recipe', {
                where: { id }
            })
            
            // SE NÃO HOUVER RECEITA, ENVIAR MENSAGEM PARA USUÁRIO
            if(!recipe) return res.render('admin/user/error', {
                error: 'Receita não encontrada!'
            })

            // DIRECIONAR PARA PÁGINA DA RECEITA
            return res.render('admin/recipes/show', { recipe })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            // PEGAR ID DA RECEITA
            const { id } = req.params
            
            // PEGAR RECEITA
            const recipe = await LoadService.load('recipe', {
                where: { id }
            })

            // PEGAR CHEFS PARA MANDAR COMO OPÇÕES
            const chefOptions = await Chef.findAll()

            // DIRECIONAR PARA PÁGINA DA RECEITA
            return res.render('admin/recipes/edit', { recipe, chefOptions })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            // PEGAR TODOS OS DADOS DA RECEITA QUE SÃO ENVIADOS PELO USUÁRIO
            const { id, title, chef_id, ingredients, preparations, information } = req.body

            // ADICIONAR NOVAS FOTOS 
            if(req.files.length != 0) {
                const filesPromise = req.files.map(file => {
                    File.createRecipeFiles({...file, recipe_id: id}) 
                })
                await Promise.all(filesPromise) 
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => 
                    File.delete(id)
                )
                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(id, {
                title,
                chef_id,
                ingredients: `{${ingredients}}`, 
                preparations: `{${preparations}}`, 
                information
            })

            return res.redirect(`/admin/recipes/${req.body.id}`)
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/edit', {
                error: 'Não foi realizar atualização. Tente novamente mais tarde.'
            })
        }
    },
    async delete(req, res) {
        try {
            // PEGAR ID DA RECEITA
            const { id } = req.body

            // PEGAR IMAGENS DA RECEITA
            let files = await Recipe.files(id)

            // DELETAR RECEITA
            await Recipe.delete(id)

            // DELETAR IMAGENS
            files.map(async file => {
                try {
                    unlinkSync(file.path)
                    await File.delete(file.id)
                } catch (error) {
                    console.error(error)
                }
            })

            return res.redirect('/admin/recipes')
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/edit', {
                error: 'Não foi possível deletar receita. Tente novamente mais tarde.'
            })
        }
    }
}