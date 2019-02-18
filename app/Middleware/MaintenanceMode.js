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
      try {
        await auth.check();
        if (auth.user.is_superadmin == true) {
          await next();
        }
      } catch (error) {
        await auth.logout();

        return response.route('error503');
      }
    } else {
      await next();
    }
  }
}

module.exports = MaintenanceMode;
