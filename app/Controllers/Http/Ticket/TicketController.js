'use strict'

const Config = use('Config')
const { statuses, priorities, impacts, reproducibles } = Config.get('ticket')
const { validateAll } = use('Validator')
const Ticket = use('App/Models/Ticket')
const Project = use('App/Models/Project')
const User = use('App/Models/User')
const ProjectServices = use('App/Services/projectServices')
const FileuploadServices = use('App/Services/fileuploadServices')
const TicketServices = use('App/Services/ticketServices')
const Moment = use('moment')
const Event = use('Event')

class TicketController {
  async index({ auth, view }) {
    const ticketsNeu = await TicketServices.ticketGroupedByStatus('Neu', auth.user.id)
    const ticketsAnerkannt = await TicketServices.ticketGroupedByStatus('Anerkannt', auth.user.id)
    const ticketsWarten = await TicketServices.ticketGroupedByStatus('Warten', auth.user.id)
    const ticketsFeedback = await TicketServices.ticketGroupedByStatus('Feedback', auth.user.id)
    const ticketsBearbeitung = await TicketServices.ticketGroupedByStatus('Bearbeitung', auth.user.id)

    const userProjects = await ProjectServices.getUserProjects(auth.user.id, 'open', auth.user.locale)

    return view.render('tickets.index', {
      ticketsNeu: ticketsNeu.toJSON(),
      ticketsAnerkannt: ticketsAnerkannt.toJSON(),
      ticketsWarten: ticketsWarten.toJSON(),
      ticketsFeedback: ticketsFeedback.toJSON(),
      ticketsBearbeitung: ticketsBearbeitung.toJSON(),
      userProjects: userProjects.toJSON(),
      priorities: priorities[0][auth.user.locale]
    })
  }

  async projectIndex({ params, auth, view }) {
    const ticketsNeu = await TicketServices.ticketGroupedByStatusAndProject('Neu', auth.user.id, params.id)
    const ticketsAnerkannt = await TicketServices.ticketGroupedByStatusAndProject('Anerkannt', auth.user.id, params.id)
    const ticketsWarten = await TicketServices.ticketGroupedByStatusAndProject('Warten', auth.user.id, params.id)
    const ticketsFeedback = await TicketServices.ticketGroupedByStatusAndProject('Feedback', auth.user.id, params.id)
    const ticketsBearbeitung = await TicketServices.ticketGroupedByStatusAndProject('Bearbeitung', auth.user.id, params.id)

    const userProjects = await ProjectServices.getUserProjects(auth.user.id, 'open', auth.user.locale)

    return view.render('tickets.index', {
      ticketsNeu: ticketsNeu.toJSON(),
      ticketsAnerkannt: ticketsAnerkannt.toJSON(),
      ticketsWarten: ticketsWarten.toJSON(),
      ticketsFeedback: ticketsFeedback.toJSON(),
      ticketsBearbeitung: ticketsBearbeitung.toJSON(),
      userProjects: userProjects.toJSON(),
      priorities: priorities[0][auth.user.locale]
    })
  }

  async show({ auth, params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .with('ticketRecipient', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .with('ticketForwarder', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .with('comments', (builder) => {
        builder.with('commentAuthor')
      })
      .with('project.members', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .first()

    return view.render('tickets.show', {
      ticket: ticket.toJSON(),
      statuses: statuses[0][auth.user.locale],
      priorities: priorities[0][auth.user.locale],
      impacts: impacts[0][auth.user.locale],
      reproducibles: reproducibles[0][auth.user.locale]
    })
  }

  async create({ auth, view }) {
    const projects = await Project.query()
      .select('id', 'title')
      .where('is_active', true)
      .andWhere(function() {
        this
          .where('author_id', auth.user.id)
          .orWhereHas('members', (builder) => {
            builder.where('user_id', auth.user.id)
          })
      })
      .fetch()

    return view.render('tickets.create', {
      statuses: statuses,
      priorities: priorities[0][auth.user.locale],
      impacts: impacts[0][auth.user.locale],
      reproducibles: reproducibles[0][auth.user.locale],
      projects: projects.toJSON()
    })
  }

  async store({ request, auth, session, response }) {
    // Create Project
    const ticket = await Ticket.create({
      subject: request.input('subject'),
      description: request.input('description'),
      priority: request.input('priority'),
      impact: request.input('impact'),
      reproducible: request.input('reproducible'),
      author_id: auth.user.id,
      project_id: request.input('project'),
      recipient_id: request.input('recipient'),
      done_until: request.input('done_until')
    })

    const files = request.file('attachments', {
      size: '10mb'
    })

    ticket.attachments = await FileuploadServices.storeMultiple(
      files,
      'tickets',
      ticket
    )

    // Sende eine Notifikation falls der Recipient NICHT der Author ist
    if(ticket.recipient_id != null && ticket.recipient_id != auth.user.id) {
      const user = await ticket.ticketRecipient().fetch()

      Event.fire('new::ticket', { ticket, user })
    }

    await ticket.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Das Ticket wurde erfolgreich angelegt.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  async edit({ auth, params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .with('ticketRecipient', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .with('project', (builder) => {
        builder.select('id', 'title')
      })
      .first()

    let attachments = null
    let attachmentsCurrent = null

    if(ticket.attachments) {
      attachments = JSON.parse(ticket.attachments)
      attachmentsCurrent = ticket.attachments
    }

    return view.render('tickets.edit', {
      priorities: priorities[0][auth.user.locale],
      impacts: impacts[0][auth.user.locale],
      reproducibles: reproducibles[0][auth.user.locale],
      ticket: ticket.toJSON(),
      attachments: attachments,
      attachmentsCurrent: attachmentsCurrent,
      doneUntil: Moment(ticket.done_until).format('YYYY-MM-DD')
    })
  }

  async update({ params, auth, request, session, response }) {
    const ticket = await Ticket.find(params.id)

    const newFiles = request.file('attachments')
    const modifiedFiles = JSON.parse(request.input('modified-files'))
    const storedFiles = JSON.parse(ticket.attachments)

    ticket.attachments = await FileuploadServices.updateMultiple(
      modifiedFiles,
      storedFiles,
      newFiles,
      'tickets',
      ticket
    )

    ticket.subject = request.input('subject')
    ticket.description = request.input('description')
    ticket.priority = request.input('priority')
    ticket.impact = request.input('impact')
    ticket.reproducible = request.input('reproducible')
    ticket.author_id = auth.user.id
    ticket.project_id = request.input('project')
    ticket.recipient_id = request.input('recipient')
    ticket.time_expenses = request.input('time_expenses')
    ticket.done_until = request.input('done_until')

    await ticket.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Änderungen wurden erfolgreich übernommen.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  async assignToMe({ params, request, session, response }) {
    const ticket = await Ticket.find(params.id)

    ticket.recipient_id = request.input('recipient_id')
    ticket.status = request.input('status')

    await ticket.save()

    /* Informiere den Author, dass das Ticket übernommen und anerkannt wurde.
    Informiere NICHT, wenn der Author die selbe Person wie der Recipient ist! */
    if(ticket.recipient_id != ticket.author_id) {
      const author = await ticket.ticketAuthor().fetch()
      const recipient = await ticket.ticketRecipient().fetch()

      Event.fire('new::ticketAssigned', { ticket, author, recipient })
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'Das Ticket wurde erfolgreich übernommen.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  async changeStatus({ params, request, auth, session, response }) {
    const ticket = await Ticket.find(params.id)

    const author = await ticket.ticketAuthor().select('id').fetch()

    ticket.status = request.input('status')

    /* Informiere den Recipient, dass sich der Ticket-Status verändert hat.
    Informiere NICHT, wenn der Author die selbe Person wie der Recipient ist! */
    if(author.id != auth.user.id && ticket.status != 'Feedback' && ticket.status != 'Sistiert') {
      const author = await ticket.ticketAuthor().fetch()

      Event.fire('new::ticketStatusChange', { ticket, author })
    }

    await ticket.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Der Status wurde erfolgreich geändert.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })

  }

  async changeDraggedStatus({ params, request, auth, response }) {
    const ticket = await Ticket.find(params.id)

    ticket.status = request.input('status')

    /* Informiere den Author, dass sich der Ticket-Status verändert hat.
    Informiere NICHT, wenn der Author die selbe Person wie der Recipient ist! */
    const author = await ticket.ticketAuthor().fetch()

    if(author.id != auth.user.id) {
      Event.fire('new::ticketStatusChange', { ticket, author })
    }

    await ticket.save()

    return response.redirect('back')
  }

  async changeRecipient({ params, auth, request, session, response }) {
    const ticket = await Ticket.find(params.id)

    ticket.recipient_id = request.input('recipient_id')
    ticket.forwarder_id = auth.user.id

    await ticket.save()

    // Informiere den neuen Recipient, dass ihm ein Ticket zugewiesen wurde
    const user = await ticket.ticketRecipient().fetch()

    Event.fire('new::ticket', { ticket, user })

    session.flash({
      notification: {
        type: 'success',
        message: 'Das Ticket wurde erfolgreich weitergeleitet.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  // Private API
  async apiGetProjectMembers({ params, response }) {
    const project = await Project.query()
      .select('id', 'title')
      .where('id', params.id)
      .first()

    const members = await project.members()
      .select('id', 'first_name', 'last_name')
      .fetch()

    response.send(members)
  }

  // Public API
  async apiPublicTicketCreate({ request, response }) {
    const validation = await validateAll(request.headers(), {
      token: 'required',
      subject: 'required',
      description: 'required',
      priority: 'required',
      email: 'required'
    })

    if (validation.fails()) {
      return response.status(406).send(validation.messages())
    }

    const data = request.headers()

    const user = await User.query()
      .where('email', data.email)
      .first()

    const project = await Project.query()
      .where('token', data.token)
      .first()

    if (user && project) {
      const ticket = await Ticket.create({
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        author_id: user.id,
        project_id: project.id
      })

      Event.fire('new::ticket', { ticket, user })

      return response.status(200).send('Das Ticket wurde erfolgreich übermittelt.')
    }

    return response.status(500).send('Das Ticket konnte nicht erstellt werden weil entweder der User oder das Projekt nicht existieren.')
  }

  async apiPublicTicketFetch({ request, response }) {
    const validation = await validateAll(request.headers(), {
      token: 'required',
      email: 'required'
    })

    if (validation.fails()) {
      return response.status(406).send(validation.messages())
    }

    const user = await User.query()
      .where('email', request.header('email'))
      .first()

    const project = await Project.query()
      .where('token', request.header('token'))
      .first()

    if(user && project) {
      const tickets = await Ticket.query()
        .where('project_id', project.id)
        .where('author_id', user.id)
        .fetch()

      if(tickets) {
        return response.status(200).send(tickets)
      }

      return response.status(404).send('Keine Tickets vorhanden für diesen User')
    }

    return response.status(500).send('Die Tickets konnten nicht abgerufen werden weil entweder der User oder das Projekt nicht existieren.')

  }
}

module.exports = TicketController
