'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Setting {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({
    request
  }, next) {
    const View = use('View');
    const Setting = use('App/Models/Setting');
    let settings = await Setting.query().first();

    request.globals = settings;

    View.global('globals', () => {
      if (settings) {
        return settings.toJSON();
      }
    });

    await next();
  }
}

module.exports = Setting;
