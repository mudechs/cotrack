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
    const token = request.header('token')
    const email = request.header('email')

    const project = await Project.query()
      .where('token', token)
      .andWhere(function() {
        this
          .whereHas('members', (builder) => {
            builder.where('email', email)
          })
      })
      .first()

    if(project) {
      await next()
    } else {
      return response.route('error403')
    }
  }
}

module.exports = PublicApiAuth
