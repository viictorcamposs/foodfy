const cards = document.querySelectorAll ('.card')



for ( let card of cards ) {
  card.addEventListener ('click', () => {
    // MANIPULANDO CARDS
    const recipe = card.getAttribute ('id')
    window.location.href = `/recipes/detail/${recipe}`
  })
}
