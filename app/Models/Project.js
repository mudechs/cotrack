'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return value.format('DD.MM.YYYY')
    }
    return super.formatDates(field, value)
  }

  /**
   * @method projectAuthor
   *
   * @return {Object}
   */
  projectAuthor() {
    return this.belongsTo('App/Models/User', 'author_id', 'id')
  }

  /**
   * @method members
   *
   * @return {Object}
   */
  members() {
    return this.belongsToMany('App/Models/User').pivotTable('project_users')
  }

  /**
   * @method tickets
   *
   * @return {Object}
   */
  tickets() {
    return this.hasMany('App/Models/Ticket', 'id', 'project_id')
  }
}

module.exports = Project
