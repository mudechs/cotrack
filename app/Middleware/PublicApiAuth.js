'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Project = use('App/Models/Project')

class PublicApiAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const { token } = request.all()

    const project = await Project.query()
      .where('token', token)
      .first()

    if(project) {
      await next()
    } else {
      return response
        .status(403)
        .send('NO ACCESS TO THIS ROUTE')
    }
  }
}

module.exports = PublicApiAuth
