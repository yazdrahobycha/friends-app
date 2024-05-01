import './css/styles.css'
import './css/reset.css'
import {Feed} from './js/Feed.js'
import {Options} from './js/Options.js'
import {Observer} from './js/Observer.js'

// temporar functionality for burger menu button
const optionMenu = document.querySelector('.options')
const openButton = document.querySelector('.header__button')
const closeButton = document.querySelector('.options__button')
const body = document.querySelector('body')
openButton.addEventListener('click', () => {
    body.classList.add('lock')
    optionMenu.classList.remove('hidden')
})
closeButton.addEventListener('click', () => {
    body.classList.remove('lock')
    optionMenu.classList.add('hidden')
})

// Create Observer
const observer = new Observer();

// start running app
const components = [Feed, Options]
components.forEach((Component) => {
    const component = new Component(observer);
    component.init();
})