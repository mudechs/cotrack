'use strict'

class StoreProject {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      description: 'required',
      code: 'required|unique:projects, code',
      members: 'required'
    }
  }

  get messages () {
    return {
      'title.required': 'Pflichteld',
      'description.required': 'Pflichteld',
      'code.required': 'Pflichteld',
      'code.unique': 'Muss einzigartig sein',
      'members.unique': 'Member(s) auswählen'
    }
  }
}

module.exports = StoreProject
