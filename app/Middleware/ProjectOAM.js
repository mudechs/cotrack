'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Project = use('App/Models/Project')

class ProjectOam {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, auth, response }, next) {
    const project = await Project.query()
      .where('id', params.id)
      .andWhere(function() {
        this
          .where('author_id', auth.user.id)
          .orWhereHas('members', (builder) => {
            builder.where('user_id', auth.user.id)
          })
      })
      .first()

    if(project || auth.user.is_admin == true || auth.user.is_superadmin == true ) {
      await next()
    } else {
      return response
        .status(403)
        .send('NO ACCESS TO THIS ROUTE')
    }
  }
}

module.exports = ProjectOam
