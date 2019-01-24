'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')

class PublicApiAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const { token } = request.all()

    if(token != Env.get('APP_KEY')) {
      return response
        .status(403)
        .send('Kein Zugriff :-)')
    } else {
      await next()
    }
  }
}

module.exports = PublicApiAuth
