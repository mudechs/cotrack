import $ from 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap.bundle';

window.jQuery = $;
window.$ = $;

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
