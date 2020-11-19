module.exports = {
    async post(req, res, next) { 
        try {
            // VERIFICAR SE TODOS OS CAMPOS ESTÃO PREENCHIDOS
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "") {
                    return res.render('admin/recipes/create', {
                        error: 'Preencha todos os campos.'
                    })
                } 
            }
    
            if(req.files.length == 0) return res.render('admin/recipes/create', {
                error: 'Envie pelo menos 1 imagem da sua receita.'
            })
    
            next()
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/create', {
                error: 'Erro inesperado. Tente novamente.'
            })
        }
    },
    async update(req, res, next) {
        try {
            // VERIFICAR SE TODOS OS CAMPOS ESTÃO PREENCHIDOS
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "" && key != 'removed_files') {
                    return res.render('admin/recipes/edit', {
                        error: 'Preencha todos os campos.'
                    })
                } 
            }
    
            next()
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/edit', {
                error: 'Erro inesperado. Tente novamente.'
            })
        }
    }
}