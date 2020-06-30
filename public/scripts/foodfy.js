const cards = document.querySelectorAll ('.card')


for ( let card of cards ) {
  card.addEventListener ('click', () => {
    const imageId = card.getAttribute ('id')
    const pratoId = card.getAttribute ('name') 
    const chefId = card.getAttribute ('chef')
  })
}
