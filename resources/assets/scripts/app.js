import $ from 'jquery/dist/jquery'
import dragula from 'dragula/dragula'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-multiselect/dist/js/bootstrap-multiselect'
import axios from 'axios/dist/axios'
import helpers from './helpers'
import { DataTable } from 'simple-datatables'

window.jQuery = $
window.$ = $
window.dragula = dragula
window.axios = axios
window.helpers = helpers
window.datatable = DataTable

$(document).ready(function () {
  $('.multiselect').multiselect({
    buttonWidth: '100%'
  })

  /* $('.linkable tr').on('click', 'td:not(:has(a))', function(e) {
    e.preventDefault()

    const url = $(this).closest('tr').data('route')

    if (url) {
      window.location.href = url
    }

    return false
  }) */
})
