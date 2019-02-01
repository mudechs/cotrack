'use strict'

const Config = use('Config')
const { statuses } = Config.get('ticket')
const Project = use('App/Models/Project')
const Ticket = use('App/Models/Ticket')

class projectServices {
  async getUserProjects(user) {
    const statusesOpen = await Ticket.ticketStatuses(statuses, 'open')

    return await Project.query()
      .where('is_active', true)
      .where('author_id', user)
      .orWhereHas('members', (builder) => {
        builder.where('user_id', user)
      })
      .withCount('tickets', (builder) => {
        builder.whereIn('status', statusesOpen)
      })
      .orderBy('title', 'asc')
      .fetch()
  }
}

module.exports = new projectServices()
