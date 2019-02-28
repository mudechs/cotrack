'use strict';

class StoreUser {
  get validateAll() {
    return true;
  }

  get rules() {
    const userId = this.ctx.params.id;

    return {
      salutation: 'required',
      first_name: 'required',
      last_name: 'required',
      email: `unique:users,email,id,${userId}`
    };
  }

  get messages() {
    return {
      'salutation.required': 'Pflichteld',
      'first_name.required': 'Pflichteld',
      'last_name.required': 'Pflichteld',
      'email.required': 'Pflichtfeld',
      'email.email': 'Kein gültiges E-Mailformat',
      'email.unique': 'E-Mail bereits vorhanden'
    };
  }
}

module.exports = StoreUser;
