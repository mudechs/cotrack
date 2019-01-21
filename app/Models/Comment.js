'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return value.format('LLLL')
    }
    return super.formatDates(field, value)
  }

  /**
   * @method commentAuthor
   *
   * @return {Object}
   */
  commentAuthor() {
    return this.belongsTo('App/Models/User', 'author_id', 'id')
  }

  /**
   * @method ticket
   *
   * @return {Object}
   */
  ticket() {
    return this.belongsTo('App/Models/Ticket', 'ticket_id', 'id')
  }
}

module.exports = Comment
