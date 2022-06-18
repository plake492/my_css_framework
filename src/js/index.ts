import '../scss/index.scss'
// import { init as transtions } from './transitions'

// transtions()

const imageWrapper = document.querySelector('.img-block')
const images = Array.from(imageWrapper.querySelectorAll('img'))

images.forEach(el => {
  el.addEventListener('mouseenter', (event: MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      event.target.style.transform = 'scale(1.02)'
    }
  })
  el.addEventListener('mouseout', ({ target }) => {
    if (target instanceof HTMLElement) {
      target.style.transform = null
    }
  })
})
