const modalOverlay = document.querySelector ('.modal-overlay')
const cards = document.querySelectorAll ('.card')


for ( let card of cards ) {
  card.addEventListener ('click', () => {
    modalOverlay.classList.add ('active')
    const imageId = card.getAttribute ('id')
    const pratoId = card.getAttribute ('name') 
    const chefId = card.getAttribute ('chef')
    modalOverlay.querySelector ('img').src = `/assets/${imageId}`
    modalOverlay.querySelector ('h2').textContent = `${pratoId}`
    modalOverlay.querySelector ('p').textContent = `${chefId}`
  })
}

/* MANIPULANDO CLOSE-MODAL */
document.querySelector ('.close-modal').addEventListener ('click', () => {
  modalOverlay.classList.remove ('active')
  modalOverlay.querySelector ('img').src = ''
  modalOverlay.querySelector ('h2').textContent = ''
  modalOverlay.querySelector ('p').textContent = ''
})
