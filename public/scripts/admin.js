// Código para adicionar campos de ingredientes e passos na página de criar receitas
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
if ( preparation ) preparation.addEventListener ( 'click', addPreparation )

// Código para manter link do menu marcado de acordo com a página
const currentPage = location.pathname
const menuLinks = document.querySelectorAll ( 'header nav .links a')

for ( link of menuLinks ) {
    if ( currentPage.includes ( link.getAttribute ('href') )) {
        link.classList.add ( 'active' )
    }
}

// Código para adicionar modal de confirmação na hora de deletar receitas e chefs
const modal = document.getElementById ( 'modal' )
const addModal = document.querySelector ( '.buttons .addModal' )
const removeModal = document.querySelector ( '#modal .removeModal' )

addModal.addEventListener ( 'click', () => {
    modal.classList.remove ( 'hide' )
})
removeModal.addEventListener ( 'click', () => {
    modal.classList.add ( 'hide' )
})