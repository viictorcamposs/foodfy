function post(req, res, next) {
    try {
        // VERIFICAR O CAMPO name ESTÁ PREENCHIDO ANTES DE SALVAR
        const key = Object.keys(req.body)
        if(req.body[key] == "") return res.render('admin/chefs/create', {
            error: 'Por favor, preencha todos os campos.'
        })

        // VERIFICAR SE ALGUMA FOTO FOI ENVIADA
        if(req.file == 0) return res.render('admin/chefs/create', {
            error: 'Envie uma foto do seu chef.'
        })

        next()
    } catch (error) {
        console.error(error)
        return res.render('admin/chefs/create', {
            error: 'Erro inesperado. Tente novamente.'
        })
    }
}

function update(req, res, next) {
    const key = Object.keys(req.body)
    if(key == "") return res.send('Preencha todos os campos.')

    next()
}

module.exports = {
    post,
    update
}