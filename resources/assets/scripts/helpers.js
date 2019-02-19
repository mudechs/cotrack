'use strict';

import { DataTable } from 'simple-datatables';
import axios from 'axios';

// Tabs
function openTab(evt, tabName) {
  const tab = evt.currentTarget.closest('div');
  const content = evt.currentTarget.closest('div').nextElementSibling;
  const tabs = content.getElementsByClassName('content-tab');
  let i, tablinks;

  for (i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  tablinks = tab.getElementsByClassName('tab');
  for (i = 0; i < tabs.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' is-active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' is-active';
}

function showNotification() {
  document.getElementById('notification').style.display = 'block';
  setTimeout(function () {
    document.getElementById('notification').style.display = 'none';
  }, 3000);
}

function showToast() {
  document.getElementById('toast').style.display = 'block';
  setTimeout(function () {
    document.getElementById('toast').style.display = 'none';
  }, 3000);
}

function formSerialize(formElement) {
  const values = {};
  const inputs = formElement.elements;

  for (let i = 0; i < inputs.length; i++) {
    values[inputs[i].name] = inputs[i].value;
  }
  return values;
}

function clickableRow(event) {
  window.location.href = event.currentTarget.dataset.href;
}

function dataTable(table, col, order) {
  const dataTable = new DataTable(table, {
    columns: [{
      select: col,
      sort: order
    }],
    labels: {
      placeholder: '',
      perPage: '{select}',
      info: '{start} &rarr; {end} ({rows})',
    }
  });

  return dataTable;
}

function saveDraggedTicket(evt) {
  const status = evt.to.id;
  const id = evt.item.id;

  const url = '/tickets/change/dragged/status/' + id;

  axios.post(url, {
    status: status
  })
    .then(function () {
      showToast();
      // console.log(response)
    })
    .catch(function () {
      showToast();
      // console.log(error)
    });
}

function validateRegex(data, pattern) {
  var rgx = pattern;
  return data.match(rgx);
}

export default {
  openTab,
  showNotification,
  showToast,
  formSerialize,
  clickableRow,
  dataTable,
  saveDraggedTicket,
  validateRegex
};
