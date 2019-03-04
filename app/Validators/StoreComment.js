'use strict';

class StoreComment {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      body: 'required'
    };
  }

  get messages() {
    return {
      'body.required': 'Pflichteld'
    };
  }
}

module.exports = StoreComment;
