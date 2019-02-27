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

  async projectIndex({ params, auth, view }) {
    const ticketsNeu = await TicketServices.ticketGroupedByStatusAndProject(
      1,
      auth.user.id,
      params.id
    );
    const ticketsAnerkannt = await TicketServices.ticketGroupedByStatusAndProject(
      2,
      auth.user.id,
      params.id
    );
    const ticketsWarten = await TicketServices.ticketGroupedByStatusAndProject(
      4,
      auth.user.id,
      params.id
    );
    const ticketsFeedback = await TicketServices.ticketGroupedByStatusAndProject(
      5,
      auth.user.id,
      params.id
    );
    const ticketsBearbeitung = await TicketServices.ticketGroupedByStatusAndProject(
      6,
      auth.user.id,
      params.id
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

  async show({ auth, params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor', builder => {
        builder.select('id', 'first_name', 'last_name', 'is_available');
      })
      .with('ticketRecipient', builder => {
        builder.select('id', 'first_name', 'last_name', 'is_available');
      })
      .with('ticketForwarder', builder => {
        builder.select('id', 'first_name', 'last_name', 'is_available');
      })
      .with('comments', builder => {
        builder.with('commentAuthor');
      })
      .with('project.members', builder => {
        builder
          .select('id', 'first_name', 'last_name', 'is_available')
          .where('is_active', true)
          .orderBy('last_name', 'asc')
          .whereNot('user_id', auth.user.id);
      })
      .first();

    return view.render('tickets.show', {
      ticket: ticket.toJSON(),
      statuses: statuses[0][auth.user.locale],
      priorities: priorities[0][auth.user.locale],
      impacts: impacts[0][auth.user.locale],
      reproducibles: reproducibles[0][auth.user.locale]
    });
  }

  async create({ auth, view }) {
    const projects = await Project.query()
      .select('id', 'title')
      .where('is_active', true)
      .andWhere(function () {
        this.where('author_id', auth.user.id).orWhereHas('members', builder => {
          builder.where('user_id', auth.user.id);
        });
      })
      .fetch();

    return view.render('tickets.create', {
      statuses: statuses,
      priorities: priorities[0][auth.user.locale],
      impacts: impacts[0][auth.user.locale],
      reproducibles: reproducibles[0][auth.user.locale],
      projects: projects.toJSON()
    });
  }

  async store({ request, auth, session, response }) {
    // Get formdata
    const ticket = await Ticket.create({
      subject: request.input('subject'),
      description: request.input('description'),
      priority: request.input('priority'),
      impact: request.input('impact'),
      reproducible: request.input('reproducible'),
      author_id: auth.user.id,
      project_id: request.input('project'),
      recipient_id: request.input('recipient'),
      done_until: request.input('done_until'),
      affected_version: request.input('affected_version'),
      resolved_version: request.input('resolved_version')
    });

    const files = request.file('attachments', {
      size: '10mb'
    });

    ticket.attachments = await FileuploadServices.storeMultiple(
      files,
      'tickets',
      ticket
    );

    await ticket.save();

    let recipient;
    const author = await ticket
      .ticketAuthor()
      .select('first_name', 'last_name')
      .fetch();
    const project = await ticket.project().fetch();

    if (ticket.recipient_id == null) {
      // Sende eine Notifikation an den Author des Projektes, wenn KEIN Recipient ausgewählt wurde
      recipient = await project
        .projectAuthor()
        .select('id', 'email', 'locale')
        .fetch();
      if (auth.user.id != recipient.id) {
        Event.fire('new::ticketUnassigned', {
          ticket,
          project,
          author,
          recipient
        });
      }
    } else if (ticket.recipient_id != auth.user.id) {
      // Sende eine Notifikation falls der Recipient NICHT der Author ist
      recipient = await ticket.ticketRecipient().fetch();

      Event.fire('new::ticket', {
        ticket,
        project,
        author,
        recipient
      });
    }

    const message = Antl.forLocale(auth.user.locale).formatMessage(
      'messages.message3'
    );

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    Logger.info(
      `Ticket created by ${auth.user.first_name} ${auth.user.last_name}`, {
        url: request.url(),
        user: auth.user.id,
        record: ticket.id,
        created_at: ticket.created_at
      }
    );

    return response.route('ticketsShow', {
      id: ticket.id
    });
  }

  async edit({ auth, params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor', builder => {
        builder.select('id', 'first_name', 'last_name');
      })
      .with('ticketRecipient', builder => {
        builder.select('id', 'first_name', 'last_name');
      })
      .with('project', builder => {
        builder.select('id', 'title');
      })
      .first();

    const project = await ticket.project().fetch();
    const versions = await project.versions().fetch();

    let attachments = null;
    let attachmentsCurrent = null;

    if (ticket.attachments) {
      attachments = JSON.parse(ticket.attachments);
      attachmentsCurrent = ticket.attachments;
    }

    return view.render('tickets.edit', {
      priorities: priorities[0][auth.user.locale],
      impacts: impacts[0][auth.user.locale],
      reproducibles: reproducibles[0][auth.user.locale],
      ticket: ticket.toJSON(),
      versions: versions.toJSON(),
      attachments: attachments,
      attachmentsCurrent: attachmentsCurrent,
      doneUntil: Moment(ticket.done_until).format('YYYY-MM-DD')
    });
  }

  async update({ params, auth, request, session, response }) {
    const ticket = await Ticket.find(params.id);

    const newFiles = request.file('attachments');
    const modifiedFiles = JSON.parse(request.input('modified-files'));
    const storedFiles = JSON.parse(ticket.attachments);

    ticket.attachments = await FileuploadServices.updateMultiple(
      modifiedFiles,
      storedFiles,
      newFiles,
      'tickets',
      ticket
    );

    ticket.subject = request.input('subject');
    ticket.description = request.input('description');
    ticket.priority = request.input('priority');
    ticket.impact = request.input('impact');
    ticket.reproducible = request.input('reproducible');
    ticket.author_id = auth.user.id;
    ticket.project_id = request.input('project');
    ticket.recipient_id = request.input('recipient');
    ticket.time_expenses = request.input('time_expenses');
    ticket.done_until = request.input('done_until');
    ticket.affected_version = request.input('affected_version');
    ticket.resolved_version = request.input('resolved_version');

    await ticket.save();

    const message = Antl.forLocale(auth.user.locale).formatMessage(
      'messages.message2'
    );

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    Logger.info(
      `Ticket updated by ${auth.user.first_name} ${auth.user.last_name}`, {
        url: request.url(),
        user: auth.user.id,
        record: ticket.id,
        updated_at: ticket.updated_at
      }
    );

    return response.route('ticketsShow', {
      id: ticket.id
    });
  }

  
}

module.exports = TicketController;
