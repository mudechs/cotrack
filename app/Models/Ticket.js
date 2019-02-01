'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const markdown = require('showdown')

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

  // Konvertieren von MD -> HTML
  static get computed () {
    return ['descriptionHtml']
  }

  getDescriptionHtml ({ description }) {
    const mdc = new markdown.Converter()
    return mdc.makeHtml(description)
  }

  // Parsen um im Frontend iterieren zu können
  getAttachments (attachments) {
    return JSON.parse(attachments)
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
