const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

const htmlMail = (name, token) =>  `
<h2>Olá, ${name}.</h2>    
<p>Você solicitou uma chave para recuperação de senha?</p>      
<h3>Segue abaixo um link para continuar o procedimento</h3>
<a href="http://localhost:3000/admin/users/reset-password?token=${token}" target="_blank">
CLIQUE AQUI PARA RECUPERAR SUA SENHA
</a>
<p>Caso não tenha sido você que solicitou a troca de senha, apenas ignore esta mensagem.</p>
<br>
<p>Atenciosamente, Equipe Foodfy</p>
`

module.exports = {
    loginForm(req, res) {
        return res. render('admin/session/login') 
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/admin/users/profile')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render('admin/session/forgot-password')
    },
    async forgot(req, res) {
        // PEGAR USUÁRIO
        const { user } = req
        try {
            // CRIAR TOKEN DE AUTENTICAÇÃO DO USUÁRIO
            const token = crypto.randomBytes(20).toString('hex')

            // CRIAR EXPIRAÇÃO DO TOKEN
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            // ATUALIZAR USUÁRIO
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // ENVIAR EMAIL COM LINK DE ATUALIZAÇÃO DE SENHA
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Solicitação de recuperação de senha.',
                html: htmlMail(user.name, token)
            })
        
            // ENVIAR MENSAGEM DE SUCESSO PARA O USUÁRIO
            return res.render('admin/session/forgot-password', {
                success: 'Email enviado com sucesso. Verifique sua conta para continuar o procedimento de atualização de senha.'
            })
        } catch (error) {
            console.error(error)
            return res.render('admin/session/forgot-password', {
                error: "Erro inesperado. Por favor, tente novamente."
            })
        }
    },
    resetForm(req, res) {
        return res.render('admin/session/reset-password', {
            token: req.query.token
        })
    },
    async reset(req, res) {
        // PEGAR USUÁRIO E NOVA SENHA
        const { user } = req
        const { password } = req.body

        try {
            // CRIAR CRIPTOGRAFIA DE SENHA DO USUÁRIO
            const newPassword = await hash(password, 8)

            // ATUALIZAR USUÁRIO
            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            })

            // ENVIAR MENSAGEM DE SUCESSO PARA O USUÁRIO
            return res.render('admin/session/login', {
                user: req.body,
                success: 'Senha atualizada com sucesso.'
            })
        } catch (error) {
            console.error(error)
            return res.render('admin/session/reset-password', {
                user: req.body,
                error: "Erro inesperado. Por favor, tente novamente."
            })
        }
    }
}