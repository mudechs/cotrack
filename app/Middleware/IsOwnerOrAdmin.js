'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

class IsOwnerOrAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, auth, response }, next) {
    const { id } = await User.find(auth.user.id)
    const reqId = params.id

    if(id == reqId || auth.user.is_admin == true) {
      await next()
    } else {
      return response
        .status(403)
        .send('Permission denied!')
    }
  }
}

module.exports = IsOwnerOrAdmin
