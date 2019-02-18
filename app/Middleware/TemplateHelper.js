'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class TemplateHelper {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const View = use('View')

    View.global('activeRoute', function(url) {
      url = '/' + url.replace('*', '(.*)')

      return request.match(url) ? 'is-active' : ''
    })

    await next()
  }
}

module.exports = TemplateHelper
