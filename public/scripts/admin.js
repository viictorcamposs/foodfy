// CÓDIGO PARA ADICIONAR CAMPOS DE INGREDIENTES E PASSOS NA PÁGINA DE CRIAR RECEITAS
function addIngredient() {
    const ingredients = document.querySelector('#ingredients')
    const fieldContainer = document.querySelectorAll('.ingredient')

    // const para realizar um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    // não adiciona um novo input se o último tem um valor vazio
    if(newField.children[0].value == "") return false 

    newField.children[0].value = ""
    ingredients.appendChild(newField)
} 
function addPreparation() {
    const preparations = document.querySelector('#preparations')
    const fieldContainer = document.querySelectorAll('.preparation')

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    if( newField.children[0].value == "") return false 

    newField.children[0].value = ""
    preparations.appendChild(newField)
}
const ingredient = document.querySelector('.add-ingredient')
if(ingredient) ingredient.addEventListener('click', addIngredient)
const preparation = document.querySelector('.add-preparation')
if(preparation) preparation.addEventListener('click', addPreparation)


// LÓGICA PARA FAZER UPLOAD DE FOTOS DAS RECEITAS
const PhotosUpload = {
    input: "",
    uploadLimit: 5,
    preview: document.querySelector('#photos-preview'),
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {   
            PhotosUpload.files.push(file)

            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const container = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(container)
            }
            reader.readAsDataURL(file)

        })
        PhotosUpload.updateInputFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${ uploadLimit } fotos.`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo") photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            const rest = uploadLimit - photosDiv.length
            if(rest > 1) {
                alert(`Coloque mais ${ rest } fotos.`)
            } else if(rest == 1) {
                alert(`Coloque mais ${ rest } foto.`)
            } else {
                alert("Você atingiu o limite de fotos!")
            }
            event.preventDefault()
            return true
        } 
        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()  
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const container = document.createElement('div')
        container.classList.add('photo')
        container.onclick = PhotosUpload.removePhoto
        container.appendChild(image)
        container.appendChild(PhotosUpload.getRemoveButton())
        return container
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'delete'
        return button
    },
    removePhoto(event) {
        const photoContainer = event.target.parentNode // <div class="photo">
        const newFiles = Array.from(PhotosUpload.preview.children).filter(file => {
            if(file.classList.contains('photo') && !file.getAttribute('id')) return true
        })
        
        const index = newFiles.indexOf(photoContainer)
        PhotosUpload.files.splice(index, 1)

        PhotosUpload.updateInputFiles()
        photoContainer.remove()
    },
    removeOldImage(event) {
        const imageDiv = event.target.parentNode
        if(imageDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles) {
                removedFiles.value +=  `${imageDiv.id},`
            }
            imageDiv.remove()
        }
    },
    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    }
}

// LÓGICA PARA TROCAR IMAGENS DA GALERIA NA PÁGINA DE DETALHES DAS RECEITAS
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const { target } = event

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

// LÓGICA PARA VALIDAÇÃO DE EMAIL NO FRONT-END
const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)
        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error) Validate.displayError(input, results.error)
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')
        if(errorDiv) errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat)) error = "Email inválido"

        return {
            error,
            value
        }
    }
}

 