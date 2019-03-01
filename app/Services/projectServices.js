'use strict';

const Project = use('App/Models/Project');
const TicketServices = use('App/Services/ticketServices');

class projectServices {
  async getUserProjects(userId, statusGroup, locale) {
    const statuses = await TicketServices.ticketStatuses(statusGroup, locale);

    return await Project.query()
      .where('is_active', true)
      .whereHas('tickets', (builder) => {
        builder.whereIn('status', statuses).where('recipient_id', userId);
      })
      .whereHas('members', (builder) => {
        builder.where('user_id', userId);
      })
      .withCount('tickets', (builder) => {
        builder.whereIn('status', statuses).where('recipient_id', userId);
      })
      .orderBy('title', 'asc')
      .fetch();
  }
}

module.exports = new projectServices();
