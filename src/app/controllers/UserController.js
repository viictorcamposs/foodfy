const User = require('../models/User')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')

const htmlEmail = (user, token, password) => `
<h2>Bem-vindo ao Foodfy, ${user.name}.</h2>
<p>Sua plataforma com as melhores receitas do mundo!</p>

<h3>Segue abaixo os dados do seu cadastro para acessar a plataforma e começar a criar suas próprias receitas.</h3>
<p>Email: ${user.email}</p>
<p>Senha: ${password}</p>

<a href="http://localhost:3000/admin/users/login" target="_blank">Ir para plataforma Foodfy</a>

<h2>ATENÇÃO!</h2>
<p>Recomendados que, por motivos de segurança, você já realize a atualização da sua senha.</p> 
<a href="http://localhost:3000/admin/users/reset-password?token=${token}" target="_blank">
ATUALIZAR SENHA DA PLATAFORMA FOODFY
</a>
<p>Caso não queira atualizar sua senha neste momento, você poderá clicar, à qualquer momento, em "Perdeu a senha?" na página de login do site.</p>

<p>Atenciosamente, Equipe Foodfy</p>
`

module.exports = {
    async index(req, res) {
        try {
            // PEGAR USUÁRIOS
            const users = await User.findAll()
    
            return res.render('admin/user/list', { users })
        } catch (error) {
            console.error(error)
        }
    },
    register(req, res) {
        return res.render('admin/user/register')
    },
    async post(req, res) {
        let { name, email, is_admin } = req.body
        try {
            // CRIAR SENHA E CRIPTOGRAFIA PARA USUÁRIO
            const password = crypto.randomBytes(20).toString('hex')
            const cryptoPassword = await hash(password, 8)
    
            // CRIAR TOKEN PARA ATUALIZAÇÃO DE SENHA DO USUÁRIO
            const reset_token = crypto.randomBytes(20).toString('hex')
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            // CRIAR USUÁRIO
            const id = await User.create({
                name,
                email,
                password: cryptoPassword,
                reset_token,
                reset_token_expires: now,
                is_admin: is_admin || false
            })

            // FAZER REQUISIÇÃO DE DADOS DO USUÁRIO CADASTRADO
            const user = await User.find(id)

            // ENVIAR EMAIL PARA O USUÁRIO COM DADOS PARA ATUALIZAR SENHA E REALIZAR LOGIN
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Bem-vindo ao Foodfy',
                html: htmlEmail(user, reset_token, password)
            })

            // RETORNAR MENSAGEM DE SUCESSO PARA O USUÁRIO
            return res.render('admin/user/register', {
                success: 'Usuário cadastrado com sucesso.'
            }) 
        } catch (error) {
            console.error(error)
            return res.render('admin/user/register', {
                error: 'Erro inesperado. Tente novamente.'
            })
        }
    },
    async edit(req, res) {
        try {
            // PEGAR USUÁRIO
            const { id } = req.params
            const user = await User.findOne({ where: { id }})

            return res.render('admin/user/edit', { user })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        // PEGAR USUÁRIO E DADOS PARA ATUALIZAÇÃO
        const { user } = req
        let { name, email, is_admin } = req.body

        try {
            await User.update(user.id, {
                name,
                email,
                is_admin: is_admin || false
            })

            return res.render('admin/user/edit', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            })
        } catch (error) {
            console.error(error)
            return res.render('admin/user/edit', {
                user: req.body,
                error: 'Não foi possível fazer atualização. Tente novamente mais tarde.'
            })
        }
    },
    async delete(req, res) {
        const { id } = req.body;

        await User.delete(id);

        return res.redirect('/admin/users');
    }
}