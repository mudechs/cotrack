'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');

class UserOA {
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
      id,
      is_superadmin
    } = await User.find(auth.user.id);
    const reqId = params.id;

    if (id == reqId || auth.user.is_superadmin == true || (auth.user.is_admin == true && auth.user.is_superadmin != is_superadmin)) {
      await next();
    } else {
      return response.route('error403');
    }
  }
}

module.exports = UserOA;
