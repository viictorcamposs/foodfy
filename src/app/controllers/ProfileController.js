const User = require('../models/User')

module.exports = {
    async index(req, res) {
        // PEGAR id DO USUÁRIO LOGADO
        const { userId: id } = req.session

        // BUSCAR USUÁRIO NO BANCO DE DADOS
        const user = await User.findOne({ where: { id }}) 

        return res.render('admin/user/index', { user })
    },
    async put(req, res) {
        // PEGAR USUÁRIO E DADOS QUE ESTÃO SENDO ATUALIZADOS
        const { user } = req
        const { name, email } = req.body
        
        try {
            // FAZER ATUALIZAÇÃO
            await User.update(user.id, {
                name, 
                email
            })
        
            // RETORNAR MENSAGEM DE SUCESSO
            return res.render('admin/parts/animation', {
                animation: 'success',
                mainMessage: 'Usuário atualizado com sucesso!',
                button: 'Ver lista de usuários',
                link: '/admin/users'
            }) 
        } catch (error) {
            console.error(error)
            return res.render('admin/user/index', {
                error: 'Não foi possível fazer atualização. Tente novamente mais tarde.'
            })
        }
    }
}