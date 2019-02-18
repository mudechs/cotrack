import axios from 'axios'
import helpers from './helpers'
import choices from 'choices.js'
import sortable from 'sortablejs'

window.axios = axios
window.helpers = helpers
window.choices = choices
window.sortable = sortable

document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      })
    })
  }

  // Dropdowns
  const $dropdowns = getAll('.has-dropdown:not(.is-hoverable)')

  if ($dropdowns.length > 0) {
    $dropdowns.forEach(function ($el) {
      $el.addEventListener('click', function (event) {
        event.stopPropagation();
        $el.classList.toggle('is-active');
      })
    })

    document.addEventListener('click', function () {
      closeDropdowns();
    })
  }

  function closeDropdowns() {
    $dropdowns.forEach(function ($el) {
      $el.classList.remove('is-active');
    })
  }

  // Close dropdowns if ESC pressed
  document.addEventListener('keydown', function (event) {
    let e = event || window.event
    if (e.keyCode === 27) {
      closeDropdowns();
    }
  })

  // Functions
  function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }
})
