'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, response }, next) {
    if(auth.user.is_admin == true) {
      await next()
    } else {
      return response
        .status(403)
        .send('Kein Zugriff :-)')
    }
  }
}

module.exports = IsAdmin
