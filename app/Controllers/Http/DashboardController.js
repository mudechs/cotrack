'use strict'

const Config = use('Config')
const { statuses, priorities } = Config.get('ticket')
const Ticket = use('App/Models/Ticket')
const TicketServices = use('App/Services/ticketServices')

class DashboardController {
  async index({ auth, view }) {
    const customStatuses = await TicketServices.ticketStatuses('open', auth.user.locale)

    const ticketsAssignedToMe = await Ticket.query()
      .where('recipient_id', auth.user.id)
      .where('status', 'Neu')
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()

    const ticketsAssignedToOthers = await Ticket.query()
      .where('author_id', auth.user.id)
      .where('recipient_id', null)
      .whereNot('recipient_id', auth.user.id)
      .whereIn('status', customStatuses)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()

    const ticketsNotAssigned = await Ticket.query()
      .whereNull('recipient_id')
      .whereIn('status', customStatuses)
      .orderBy('created_at', 'desc')
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .withCount('comments')
      .fetch()

    return view.render('dashboard', {
      ticketsAssignedToMe: ticketsAssignedToMe.toJSON(),
      ticketsAssignedToOthers: ticketsAssignedToOthers.toJSON(),
      ticketsNotAssigned: ticketsNotAssigned.toJSON(),
      priorities: priorities[0][auth.user.locale],
      statuses: statuses[0][auth.user.locale]
    })
  }
}

module.exports = DashboardController
