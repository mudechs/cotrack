'use strict';
const Config = use('Config');
const { statuses, priorities, impacts, reproducibles } = Config.get('ticket');
const { validateAll } = use('Validator');
const Ticket = use('App/Models/Ticket');
const Project = use('App/Models/Project');
const User = use('App/Models/User');
const ProjectServices = use('App/Services/projectServices');
const FileuploadServices = use('App/Services/fileuploadServices');
const TicketServices = use('App/Services/ticketServices');
const Moment = use('moment');
const Event = use('Event');
const Antl = use('Antl');
const Logger = use('Logger');

class TicketController {
  async index({ auth, view }) {
    const ticketsNeu = await TicketServices.ticketGroupedByStatus(
      1,
      auth.user.id
    );
    const ticketsAnerkannt = await TicketServices.ticketGroupedByStatus(
      2,
      auth.user.id
    );
    const ticketsWarten = await TicketServices.ticketGroupedByStatus(
      4,
      auth.user.id
    );
    const ticketsFeedback = await TicketServices.ticketGroupedByStatus(
      5,
      auth.user.id
    );
    const ticketsBearbeitung = await TicketServices.ticketGroupedByStatus(
      6,
      auth.user.id
    );

    const userProjects = await ProjectServices.getUserProjects(
      auth.user.id,
      'open',
      auth.user.locale
    );

    return view.render('tickets.index', {
      ticketsNeu: ticketsNeu.toJSON(),
      ticketsAnerkannt: ticketsAnerkannt.toJSON(),
      ticketsWarten: ticketsWarten.toJSON(),
      ticketsFeedback: ticketsFeedback.toJSON(),
      ticketsBearbeitung: ticketsBearbeitung.toJSON(),
      userProjects: userProjects.toJSON(),
      priorities: priorities[0][auth.user.locale]
    });
  }

  
}

module.exports = TicketController;
