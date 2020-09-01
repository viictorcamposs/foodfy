// menu selected link
const currentPage = location.pathname
const menuLinks = document.querySelectorAll ( 'header nav .links a')
for ( link of menuLinks ) {
    if ( currentPage.includes ( link.getAttribute ('href') )) {
        link.classList.add ( 'active' )
    }
}

// manipulating card in recipes page
const cards = document.querySelectorAll ( '.card' )
for ( let card of cards ) {
    card.addEventListener ( 'click', () => {
        const recipe = card.getAttribute ( 'id' )
        window.location.href = `/recipes/${ recipe }`
    })
}

// show and hide div content in detail page
const detail = document.getElementsByClassName ( 'recipe-detail' )
for ( let i = 0; i < detail.length; i++ ) {
    const span = detail[i].querySelector ( 'span' )
    const content = detail[i].querySelector ( '.content' )

    span.addEventListener ( 'click', () => {
        if ( span.innerHTML === 'Mostrar' ) { 
            content.classList.add ( 'showContent' )
            span.innerText = 'Esconder'
        } else {
            content.classList.remove ( 'showContent' )
            span.innerText = 'Mostrar'
        }
    })
}