'use strict'

const markdown = require('showdown')
const Comment = use('App/Models/Comment')

class markdownServices {
  async convertToHtml(data, field) {
    if(Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const mdc = new markdown.Converter()
        data[i][field] = mdc.makeHtml(data[i][field])
      }
    } else {
      const mdc = new markdown.Converter()
      data = mdc.makeHtml(data)
    }

    return data
  }
}

module.exports = new markdownServices()
