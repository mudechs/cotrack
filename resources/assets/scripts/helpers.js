'use strict'

export default {
  formSerialize(formElement) {
    const values = {}
    const inputs = formElement.elements

    for (let i = 0; i < inputs.length; i++) {
      values[inputs[i].name] = inputs[i].value
    }
    return values
  },
  clickableRow() {
    const rows = document.querySelectorAll('tr[data-href]')
    rows.forEach(row => {
      row.addEventListener('click', () => {
        window.location.href = row.dataset.href
      })
    })
  }
}