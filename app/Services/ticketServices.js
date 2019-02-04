'use strict'

const Config = use('Config')
const { statuses } = Config.get('ticket')
const Ticket = use('App/Models/Ticket')

class ticketServices {
  ticketStatuses(statusGroup, locale) {
    let data = []
    let localizedStatuses = statuses[0][locale]

    for(let i in localizedStatuses)
      if(localizedStatuses[i].type == statusGroup)
        data[data.length] = localizedStatuses[i].value
    return data
  }

  async ticketGroupedByStatus(status, recipient) {
    return await Ticket.query()
      .where('recipient_id', recipient)
      .where('status', status)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()
  }

  async ticketGroupedByStatusAndProject(status, recipient, project) {
    return await Ticket.query()
      .where('recipient_id', recipient)
      .where('status', status)
      .where('project_id', project)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()
  }
}

module.exports = new ticketServices()
