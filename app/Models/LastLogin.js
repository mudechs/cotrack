'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class LastLogin extends Model {

  static castDates(field, value) {
    if (field === 'created_at') {
      return value.format('DD.MM.YYYY HH:mm');
    }
    return super.formatDates(field, value);
  }
}

module.exports = LastLogin;
