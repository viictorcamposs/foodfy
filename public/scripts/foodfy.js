const cards = document.querySelectorAll ('.card')
const ingredient = document.querySelector ('.ingredients')
const prepar = document.querySelector ('.preparation')
const info = document.querySelector ('.information')
const clickOn = 'Mostrar'
const clickOff = 'Esconder'


// MANIPULANDO CARDS DA PAGE RECIPES.NJK
for ( let card of cards ) {
  card.addEventListener ('click', () => {
    const recipe = card.getAttribute ('id')
    window.location.href = `/recipes/detail/${recipe}`
  })
}

// MANIPULANDO BUTTONs DA PAGE DETAIL.NJK 
ingredient.querySelector ('p').textContent = `${clickOn}`
ingredient.querySelector ('.modal').classList.add ('active')
ingredient.querySelector ('.button').addEventListener ('click', () => {
  if ( ingredient.querySelector ('p').textContent == `${clickOn}` ) {
    ingredient.querySelector ('p').textContent = `${clickOff}`
    ingredient.querySelector ('.modal').classList.remove ('active')
  } else {
    ingredient.querySelector ('p').textContent = `${clickOn}`
    ingredient.querySelector ('.modal').classList.add ('active')
  }
})

prepar.querySelector ('p').textContent = `${clickOn}`
prepar.querySelector ('.modal').classList.add ('active')
prepar.querySelector ('.button').addEventListener ('click', () => {
  if ( prepar.querySelector ('p').textContent == `${clickOn}` ) {
    prepar.querySelector ('p').textContent = `${clickOff}`
    prepar.querySelector ('.modal').classList.remove ('active')
  } else {
    prepar.querySelector ('p').textContent = `${clickOn}`
    prepar.querySelector ('.modal').classList.add ('active')
  }
})

info.querySelector ('p').textContent = `${clickOn}`
info.querySelector ('.modal').classList.add ('active')
info.querySelector ('.button').addEventListener ('click', () => {
  if ( info.querySelector ('p').textContent == `${clickOn}` ) {
    info.querySelector ('p').textContent = `${clickOff}`
    info.querySelector ('.modal').classList.remove ('active')
  } else {
    info.querySelector ('p').textContent = `${clickOn}`
    info.querySelector ('.modal').classList.add ('active')
  }
})