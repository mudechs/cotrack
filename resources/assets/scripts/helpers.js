'use strict'

import { DataTable } from 'simple-datatables'
import axios from 'axios'

function showNotification() {
  document.getElementById('notification').style.display = 'block'
  setTimeout(function() {
    document.getElementById('notification').style.display = 'none'
  }, 3000)
}

function showToast() {
  document.getElementById('toast').style.display = 'block'
  setTimeout(function() {
    document.getElementById('toast').style.display = 'none'
  }, 3000)
}

function formSerialize(formElement) {
  const values = {}
  const inputs = formElement.elements

  for (let i = 0; i < inputs.length; i++) {
    values[inputs[i].name] = inputs[i].value
  }
  return values
}

function clickableRow() {
  const rows = document.querySelectorAll('tr[data-href]')
  rows.forEach(row => {
    row.addEventListener('click', () => {
      window.location.href = row.dataset.href
    })
  })
}

function dataTable(col, order) {
  const dataTable = new DataTable('.data-table', {
    columns: [{
      select: col,
      sort: order
    }],
    labels: {
      placeholder: '',
      perPage: '{select}',
      info: '{start} &rarr; {end} ({rows})',
    }
  })

  return dataTable
}

function saveDraggedTicket(evt) {
  const status = evt.to.id
  const id = evt.item.id

  const url = '/tickets/change/dragged/status/' + id

  axios.post(url, {
    status: status
  })
    .then(function (response) {
      showToast()
      console.log(response)
    })
    .catch(function (error) {
      showToast()
      console.log(error)
    })
}

export default {
  showNotification,
  showToast,
  formSerialize,
  clickableRow,
  dataTable,
  saveDraggedTicket
}
