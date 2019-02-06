'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Ticket = use('App/Models/Ticket')
const Project = use('App/Models/Project')

class TicketOfram {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, auth, response }, next) {
    const {
      author_id,
      forwarder_id,
      recipient_id,
      project_id
    } = await Ticket.find(params.id)

    const isMember = await Project.query()
      .where('id', project_id)
      .andWhere(function() {
        this
          .whereHas('members', (builder) => {
            builder.where('user_id', auth.user.id)
          })
      })
      .first()


    if(isMember || author_id == auth.user.id || forwarder_id == auth.user.id || recipient_id == auth.user.id || auth.user.is_admin == true || auth.user.is_superadmin == true) {
      await next()
    } else {
      return response.route('error403')
    }
  }
}

module.exports = TicketOfram
