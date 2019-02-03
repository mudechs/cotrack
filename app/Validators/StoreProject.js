'use strict'

class StoreProject {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      description: 'required'
    }
  }

  get messages () {
    return {
      'title.required': 'Pflichteld',
      'description.required': 'Pflichteld'
    }
  }
}

module.exports = StoreProject
