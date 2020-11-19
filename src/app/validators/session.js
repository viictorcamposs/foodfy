const User = require('../models/User')
const { compare } = require('bcryptjs')

module.exports = {
    async login(req, res, next) {
        // PEGAR DADOS DO LOGIN
        const { email, password } = req.body

        try {
            // BUSCAR USUÁRIO 
            const user = await User.findOne({ where: { email }})

            // VERIFICAR SE EMAIL DO USUÁRIO EXISTE
            if(!user) return res.render('admin/session/login', {
                user: req.body,
                error: 'Email não cadastrado'
            })

            // VERIFICAR SE A SENHA É A CORRETA
            const passed = await compare(password, user.password)
            if(!passed) return res.render('admin/session/login', {
                user: req.body,
                error: 'Senha incorreta.'
            })

            req.user = user

            next()
        } catch (error) {
            console.error(error)
        }
    },
    async forgot(req, res, next) {
        // PEGAR EMAIL QUE O USUÁRIO SOLICITOU RECUPERAÇÃO DE SENHA
        const { email } = req.body
        try {
            // BUSCAR USUÁRIO 
            let user = await User.findOne({
                where: { email }
            })

            // SE NÃO ENCONTRAR, ENVIAR MENSAGEM DE ERRO
            if(!user) return res.render('admin/session/forgot-password', {
                user: req.body,
                error: 'Email não cadastrado'
            })

            // SE ENCONTRAR, ENVIAR USUÁRIO PELO REQ
            req.user = user

            next()
        } catch (error) {
            console.error(error)
        }
    },
    async reset(req, res, next) {
        // PEGAR TOKEN E DADOS PARA ATUALIZAÇÃO DE SENHA DO USUÁRIO
        const { email, password, passwordRepeat, token } = req.body

        try {
            // PROCURAR USUÁRIO
            const user = await User.findOne({
                where: { email }
            })

            // VERIFICAR SE AS SENHAS CORRESPONDEM
            if(password != passwordRepeat) return res.render('admin/session/reset-password', {
                user: req.body,
                token, 
                error: 'Senhas incorretas.'
            })

            // VALIDAR TOKEN E TEMPO DE EXPIRAÇÃO
            if(token != user.reset_token) return res.render('admin/session/reset-password', {
                user: req.body,
                token, 
                error: 'Token inválido. Solicite um novo token para recuperação de senha.'
            })
            
            let now = new Date()
            now = now.setHours(now.getHours())
            if(now > user.reset_token_expires) return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: 'Limite de tempo do token expirado. Solicite um novo token para recuperação de senha.'
            })

            req.user = user

            next()
        } catch (error) {
            console.error(error)
            return res.render('admin/session/reset-password', {
                token,
                error: "Erro inesperado. Por favor, tente novamente."
            })
        }
    }
}