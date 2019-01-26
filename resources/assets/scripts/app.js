import $ from 'jquery/dist/jquery';
import dragula from 'dragula/dragula';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'datatables.net-bs4/js/dataTables.bootstrap4';

window.jQuery = $;
window.$ = $;
window.dragula = dragula;

$.extend(true, $.fn.dataTable.defaults, {
  dom: "<'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
  info: true,
  paging: true,
  lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Alle"]],
  language: {
    "search": "<i class='fas fa-filter'></i> ",
    "info": "_START_ &rarr; _END_ (_TOTAL_)",
    "emptyTable": "Keine Daten vorhanden",
    "lengthMenu": "_MENU_",
    "paginate": {
      "first":      "First",
      "last":       "Last",
      "next":       "<i class='fas fa-chevron-right'></i>",
      "previous":   "<i class='fas fa-chevron-left'></i>"
    },
  }
});

$(document).ready(function () {
  // Add loading icon on clicked submit buttons
  $('button[type=submit]').on('click', function () {
    $(this).html('<i class="fas fa-spinner fa-spin fa-fw"></i>');
  });

  $('.linkable').on('click', function(){
    const url = $(this).data('route');

    location.href = url;
  });
});
