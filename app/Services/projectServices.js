'use strict'

const Project = use('App/Models/Project')

class projectServices {
  async getUserProjects(user) {
    return await Project.query()
      .where('is_active', true)
      .where('author_id', user)
      .orWhereHas('members', (builder) => {
        builder.where('user_id', user)
      })
      .withCount('tickets')
      .orderBy('title', 'asc')
      .fetch()
  }
}

module.exports = new projectServices()
