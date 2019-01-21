import $ from 'jquery/dist/jquery';
import dragula from 'dragula/dragula';
import axios from 'axios/dist/axios';
import 'bootstrap/dist/js/bootstrap.bundle';


window.jQuery = $;
window.$ = $;
window.dragula = dragula;
window.axios = axios;

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
