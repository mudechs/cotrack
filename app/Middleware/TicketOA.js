'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Ticket = use('App/Models/Ticket');

class TicketOA {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({
    params,
    auth,
    response
  }, next) {
    const {
      author_id
    } = await Ticket.find(params.id);

    if (author_id == auth.user.id || auth.user.is_admin == true || auth.user.is_superadmin == true) {
      await next();
    } else {
      return response.route('error403');
    }
  }
}

module.exports = TicketOA;
