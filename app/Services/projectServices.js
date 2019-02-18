'use strict';

const Project = use('App/Models/Project');
const TicketServices = use('App/Services/ticketServices');

class projectServices {
  async getUserProjects(user, statusGroup, locale) {
    const statuses = await TicketServices.ticketStatuses(statusGroup, locale);

    return await Project.query()
      .where('is_active', true)
      .where('author_id', user)
      .orWhereHas('members', (builder) => {
        builder.where('user_id', user);
      })
      .withCount('tickets', (builder) => {
        builder.whereIn('status', statuses).where('recipient_id', user);
      })
      .orderBy('title', 'asc')
      .fetch();
  }
}

module.exports = new projectServices();
