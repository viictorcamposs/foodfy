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
    const PhotosUpload = {
        input: "",
        uploadLimit: 5,
        preview: document.querySelector( '#photos-preview' ),
        files: [],
        handleFileInput( event ) {
            const { files: fileList } = event.target 
            PhotosUpload.input = event.target
            
            if ( PhotosUpload.hasLimit( event ) ) return

            Array.from( fileList ).forEach( file => {   
                PhotosUpload.files.push( file )

                const reader = new FileReader()
                reader.onload = () => {
                    const image = new Image()
                    image.src = String( reader.result )

                    const container = PhotosUpload.getContainer( image )
                    PhotosUpload.preview.appendChild( container )
                }
                reader.readAsDataURL( file )
            })

            PhotosUpload.input.files = PhotosUpload.getAllFiles()
        },
        hasLimit( event ) {
            const { uploadLimit, input, preview } = PhotosUpload
            const { files: fileList } = input

            if( fileList.length > uploadLimit ) {
                alert( `Envie no máximo ${ uploadLimit } fotos.` )
                event.preventDefault()
                return true
            }

            const photosDiv = []
            preview.childNodes.forEach( item => {
                if( item.classList && item.classList.value == "photo" ) photosDiv.push( item )
            })

            const totalPhotos = fileList.length + photosDiv.length
            if( totalPhotos > uploadLimit ) {
                const rest = uploadLimit - photosDiv.length
                if( rest > 1 ) {
                    alert( `Coloque mais ${ rest } fotos.` )
                } else if( rest == 1 ) {
                    alert( `Coloque mais ${ rest } foto.` )
                } else {
                    alert( "Você atingiu o limite de fotos!" )
                }
                event.preventDefault()
                return true
            } 
            return false
        },
        getAllFiles() {
            const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()  
            PhotosUpload.files.forEach( file => dataTransfer.items.add( file ) )

            return dataTransfer.files
        },
        getContainer( image ) {
            const container = document.createElement( 'div' )
            container.classList.add( 'photo' )
            container.onclick = PhotosUpload.removePhoto
            container.appendChild( image )
            container.appendChild( PhotosUpload.getRemoveButton() )
            return container
        },
        getRemoveButton() {
            const button = document.createElement( 'i' )
            button.classList.add( 'material-icons' )
            button.innerHTML = 'delete'
            return button
        },
        removePhoto( event ) {
            const photoContainer = event.target.parentNode // <div class="photo">
            const photosArray = Array.from( PhotosUpload.preview.children )
            const index = photosArray.indexOf( photoContainer )

            PhotosUpload.files.splice( index, 1 )
            PhotosUpload.input.files = PhotosUpload.getAllFiles()

            photoContainer.remove()
        }
    }