'use strict';

class LoginUser {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: 'required|email',
      password: 'required'
    };
  }

  get messages() {
    return {
      'email.required': 'Pflichteld',
      'email.email': 'Ungültiges E-Mail Format',
      'password.required': 'Pflichteld'
    };
  }
}

module.exports = LoginUser;
