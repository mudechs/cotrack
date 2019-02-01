'use strict'

const markdown = require('showdown')

class markdownServices {
  async convertToHtml(data, field) {
    if(Array.isArray(data)) {
      const mdc = new markdown.Converter()
      for (let i = 0; i < data.length; i++) {
        data[i][field] = mdc.makeHtml(data[i][field])
        // TODO: Nicht ideal, muss anders gelöst werden
        if(data[i]['attachments'])
          data[i]['attachments'] = JSON.parse(data[i]['attachments'])
      }
    } else {
      const mdc = new markdown.Converter()
      data = mdc.makeHtml(data)
    }

    return data
  }
}

module.exports = new markdownServices()
