// CÓDIGO PARA ADICIONAR CAMPOS DE INGREDIENTES E PASSOS NA PÁGINA DE CRIAR RECEITAS
    function addIngredient () {
        const ingredients = document.querySelector ( '#ingredients' )
        const fieldContainer = document.querySelectorAll ( '.ingredient' )

        // const para realizar um clone do último ingrediente adicionado
        const newField = fieldContainer[fieldContainer.length - 1].cloneNode ( true )
        // não adiciona um novo input se o último tem um valor vazio
        if ( newField.children[0].value == "" ) return false 

        newField.children[0].value = ""
        ingredients.appendChild ( newField )
    }
    function addPreparation () {
        const preparations = document.querySelector ( '#preparations' )
        const fieldContainer = document.querySelectorAll ( '.preparation' )

        const newField = fieldContainer[fieldContainer.length - 1].cloneNode ( true )
        if ( newField.children[0].value == "" ) return false 

        newField.children[0].value = ""
        preparations.appendChild ( newField )
    }
    const ingredient = document.querySelector ( '.add-ingredient' )
    if ( ingredient ) ingredient.addEventListener ( 'click', addIngredient )
    const preparation = document.querySelector ( '.add-preparation' )
    if ( preparation ) preparation.addEventListener( 'click', addPreparation )



// LÓGICA PARA FAZER UPLOAD DE FOTOS DAS RECEITAS
    const photosUpload = {
        uploadLimit: 5,
        handleFileInput( event ) {
            const { files: fileList } = event.target 
            const { uploadLimit } = photosUpload

            if ( fileList.length > uploadLimit ) {
                alert( `Envie no máximo ${ uploadLimit } fotos.` )
                event.preventDefault()
                return 
            }
        }
    }