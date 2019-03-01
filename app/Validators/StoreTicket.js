'use strict';

class StoreTicket {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      subject: 'required',
      description: 'required',
      project: 'required'
    };
  }

  get messages() {
    return {
      'subject.required': 'Pflichteld',
      'description.required': 'Pflichteld',
      'project.required': 'Pflichteld'
    };
  }
}

module.exports = StoreTicket;
