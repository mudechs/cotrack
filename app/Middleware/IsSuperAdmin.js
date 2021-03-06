'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsSuperAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({
    auth,
    response
  }, next) {
    if (auth.user.is_superadmin == true) {
      await next();
    } else {
      return response.route('error403');
    }
  }
}

module.exports = IsSuperAdmin;
