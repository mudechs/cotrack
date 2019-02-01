'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ticket extends Model {
  static get dates() {
    return super.dates.concat(['done_until'])
  }

  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return value.format('DD.MM.YY (HH:mm)')
    }
    if (field === 'done_until') {
      return value.format('DD.MM.YYYY')
    }
    return super.formatDates(field, value)
  }

  /**
   * @method ticketAuthor
   *
   * @return {Object}
   */
  ticketAuthor() {
    return this.belongsTo('App/Models/User', 'author_id', 'id')
  }

  /**
   * @method ticketForwarder
   *
   * @return {Object}
   */
  ticketForwarder() {
    return this.belongsTo('App/Models/User', 'forwarder_id', 'id')
  }

  /**
   * @method ticketRecipient
   *
   * @return {Object}
   */
  ticketRecipient() {
    return this.belongsTo('App/Models/User', 'recipient_id', 'id')
  }

  /**
   * @method project
   *
   * @return {Object}
   */
  project() {
    return this.belongsTo('App/Models/Project', 'project_id', 'id')
  }

  /**
   * @method comments
   *
   * @return {Object}
   */
  comments() {
    return this.hasMany('App/Models/Comment', 'id', 'ticket_id')
  }
}

module.exports = Ticket
