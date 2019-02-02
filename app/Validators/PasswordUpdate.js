'use strict'

class PasswordUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      password_current: 'required',
      password: 'required|confirmed',
      password_confirmation: 'required'
    }
  }

  get messages () {
    return {
      'password_current.required': 'Pflichteld',
      'password.required': 'Pflichtfeld',
      'password.confirmed': 'Das Passwort stimmt nicht überein',
      'password_confirmation.required': 'Pflichtfeld'
    }
  }
}

module.exports = PasswordUpdate
