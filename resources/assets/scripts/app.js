import $ from 'jquery/dist/jquery'
import dragula from 'dragula/dragula'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-multiselect/dist/js/bootstrap-multiselect'
import axios from 'axios/dist/axios'
import helpers from './helpers'

window.jQuery = $
window.$ = $
window.dragula = dragula
window.axios = axios
window.helpers = helpers

$(document).ready(function () {
  $('.multiselect').multiselect({
    buttonWidth: '100%'
  })
})
