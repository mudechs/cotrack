'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Version extends Model {
  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return value.format('DD.MM.YY');
    }
    return super.formatDates(field, value);
  }

  /**
   * @method project
   *
   * @return {Object}
   */
  project() {
    return this.belongsTo('App/Models/Project', 'project_id', 'id');
  }
}

module.exports = Version;
