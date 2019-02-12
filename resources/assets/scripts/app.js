import $ from 'jquery/dist/jquery.slim'
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

$.extend(true, $.fn.dataTable.defaults, {
  dom: "<'row'<'col-6 col-sm-6 col-md-6'f><'col-6 col-sm-6 col-md-6'l>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row d-flex align-items-center'<'col-6'i><'col-6'p>>",
  'initComplete': function() {
    $('div.dataTables_length select').removeClass('custom-select custom-select-sm')
  },
  info: true,
  paging: true,
  lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Alle']],
  language: {
    'search': "<i class='fas fa-filter'></i> ",
    'info': '_START_ &rarr; _END_ (_TOTAL_)',
    'infoEmpty': '0 &rarr; 0 (0)',
    'emptyTable': 'Keine Daten vorhanden',
    'lengthMenu': '_MENU_',
    'paginate': {
      'first': "<i class='fas fa-step-backward'></i>",
      'last': "<i class='fas fa-step-forward'></i>",
      'next': "<i class='fas fa-forward'></i>",
      'previous': "<i class='fas fa-backward'></i>"
    },
  }
})

$(document).ready(function () {
  $('.multiselect').multiselect({
    buttonWidth: '100%'
  })

  // Add loading icon on clicked submit buttons
  /* $('button[type=submit]').on('click', function(e) {
    e.preventDefault()

    $(this).html('<i class="fas fa-spinner fa-spin fa-fw"></i>')
  }) */

  $('.linkable tr').on('click', 'td:not(:has(a))', function(e) {
    e.preventDefault()

    const url = $(this).closest('tr').data('route')

    if (url) {
      window.location.href = url
    }

    return false
  })
})
