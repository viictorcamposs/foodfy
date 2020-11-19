const User = require('../models/User')

async function onlyUsers(req, res, next) {
    if(!req.session.userId) return res.redirect('/admin/users/login')

    next()
}
async function onlyAdm(req, res, next) {
    // PEGAR id DO USUÁRIO LOGADO
    const { userId: id } = req.session

    // BUSCAR USUÁRIO
    const user = await User.findOne({ where: { id }})

    // VERIFICAR SE O USUÁRIO É ADMINISTRADOR
    if(!(user.is_admin == true)) {
        return res.render('admin/user/error', {
            error: 'Área restrita aos administradores.'
        })
    }

    next()
} 

function ifLoggedredirectToUsers(req, res, next) {
    if(req.session.userId) return res.redirect('/admin/users/profile')
    next()
}

module.exports = {
    ifLoggedredirectToUsers,
    onlyUsers,
    onlyAdm
}