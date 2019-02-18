'use strict';

class UpdateTicket {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      subject: 'required',
      description: 'required'
    };
  }

  get messages() {
    return {
      'subject.required': 'Pflichteld',
      'description.required': 'Pflichteld'
    };
  }
}

module.exports = UpdateTicket;
