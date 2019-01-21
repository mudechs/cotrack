import $ from 'jquery/dist/jquery';
import dragula from 'dragula/dragula';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'datatables.net-bs4/js/dataTables.bootstrap4';


window.jQuery = $;
window.$ = $;
window.dragula = dragula;

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
