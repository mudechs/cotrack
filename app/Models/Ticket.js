'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ticket extends Model {
  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at') {
      return value.format('DD.MM.YYYY HH:mm')
    }
    return super.formatDates(field, value)
  }

  static ticketStatuses(statuses, option) {
    let statusesOpen = []
    for(let i in statuses)
      if(statuses[i].type == option)
        statusesOpen[statusesOpen.length] = statuses[i].label
    return statusesOpen = statusesOpen
  }

  static async ticketGroupedByStatus(status, recipient) {
    return await Ticket.query()
      .where('recipient_id', recipient)
      .where('status', status)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()
  }

  static async ticketGroupedByStatusAndProject(status, recipient, project) {
    return await Ticket.query()
      .where('recipient_id', recipient)
      .where('status', status)
      .where('project_id', project)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()
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
