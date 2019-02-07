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
    const token = request.input('token')
    const email = request.input('email')

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
      return response.status(404).send('ERROR')
    }
  }
}

module.exports = PublicApiAuth
