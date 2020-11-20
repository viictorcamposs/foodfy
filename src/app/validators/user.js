const User = require('../models/User')
const Recipe = require('../models/Recipe')

const { compare } = require('bcryptjs')

function checkAllFields(body) {
    // Função para validar se o nome e o email estão preenchidos
    const keys = Object.keys(body)
    for(key of keys) {
        if(body[key] == "") return {
            user: body,
            error: 'Por favor, preencha todos os campos.'
        }
    }
}

module.exports = {
    async post(req, res, next) {
        try {
            // VERIFICAR SE TODOS OS CAMPOS ESTÃO PREENCHIDOS
            const emptyFields = checkAllFields(req.body)
            if(emptyFields) return res.render('admin/user/register', emptyFields)

            // VERIFICAR SE USUÁRIO JÁ EXISTE
            const { email } = req.body
            const user = await User.findOne({ where: { email }})

            // SE USUÁRIO JÁ EXISTIR, RETORNAR MENSAGEM
            if(user) return res.render('admin/user/register', {
                user: req.body,
                error: 'Usuário já cadastrado.'
            })

            next()
        } catch (error) {
            console.error(error) 
            return res.render('admin/user/register', {
                error: 'Erro inesperado. Tente novamente mais tarde.'
            })          
        }
    },
    async update(req, res, next) {
        // VERIFICAR SE TODOS OS CAMPOS ESTÃO PREENCHIDOS
        const emptyFields = checkAllFields(req.body)
        if(emptyFields) return res.render('admin/user/index', emptyFields)

        // PEGAR ID E BUSCAR USUÁRIO
        const { id, password } = req.body
        const user = await User.findOne({where: { id }})

        if(req.session.userId == id) {
            if(!password) return res.render('admin/user/index', {
                user: req.body,
                error: 'Coloque sua senha para atualizar seu cadastro.'
            })

            const passed = await compare(password, user.password)
            if(!passed) return res.render('admin/user/index', {
                user: req.body,
                error: 'Senha incorreta.'
            })
        } 

        req.user = user

        next()
    },
    async remove(req, res, next) {
        const { userId: id } = req.session
        const deletedUserId = req.body.id

        const user = await User.find(req.body.id)
        const users = await User.findAll() 

        if(id == deletedUserId) {
            return res.render('admin/user/list', {
                user,
                users,
                error: 'Não é possível deletar a própria conta.'
            })
        } else {
            next()
        }
    },
    async userPermission(req, res, next) {
        // BUSCAR id DO USUÁRIO LOGADO
        const { userId: id }  = req.session

        // BUSCAR id DA RECEITA QUE ESTÁ SENDO ACESSADA
        let recipeId = req.params.id
        if(!recipeId) recipeId = req.body.id

        // VALIDAR SE QUEM ESTÁ TENTANDO ACESSAR É UM ADM
        const user = await User.find(id)
        if(user.is_admin == true) return next()

        // CASO NÃO SEJA ADM, VALIDAR SE A RECEITA PERTENCE AO USUÁRIO
        const recipe = await Recipe.find(recipeId)
        if(recipe.user_id == user.id) {
            next()
        } else {
            return res.render('admin/user/animation', {
                animation: 'block',
                error: 'Apenas administradores podem ver as receitas de outros usuários.'
            })
        }
    }
}