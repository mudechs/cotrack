'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class MaintenanceMode {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({
    request,
    response,
    auth
  }, next) {
    if (request.globals.maintenance_mode == true) {
      const isLoggedId = await auth.check();
      if (isLoggedId && auth.user.is_superadmin == true) {
        await next();
      } else {
        await auth.logout();
        return response.route('error503');
      }
    } else {
      await next();
    }
  }
}

module.exports = MaintenanceMode;
