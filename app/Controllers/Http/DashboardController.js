'use strict'

const Config = use('Config')
const { statuses, priorities } = Config.get('ticket')
const Ticket = use('App/Models/Ticket')

class DashboardController {
  async index({ auth, view }) {
    const statusesOpen = await Ticket.ticketStatuses(statuses, 'open')

    const ticketsAssignedToMe = await Ticket.query()
      .where('recipient_id', auth.user.id)
      .whereIn('status', statusesOpen)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .fetch()

    const ticketsAssignedToOthers = await Ticket.query()
      .where('author_id', auth.user.id)
      .whereNot('recipient_id', auth.user.id)
      .whereIn('status', statusesOpen)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .fetch()

    const ticketsNotAssigned = await Ticket.query()
      .whereNull('recipient_id')
      .whereIn('status', statusesOpen)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .fetch()

    return view.render('dashboard', {
      ticketsAssignedToMe: ticketsAssignedToMe.toJSON(),
      ticketsAssignedToOthers: ticketsAssignedToOthers.toJSON(),
      ticketsNotAssigned: ticketsNotAssigned.toJSON(),
      priorities: priorities
    })
  }
}

module.exports = DashboardController
