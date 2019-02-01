'use strict'

const Config = use('Config')
const { statuses, priorities, impacts, reproducibles } = Config.get('ticket')
const { validateAll } = use('Validator')
const Ticket = use('App/Models/Ticket')
const Project = use('App/Models/Project')
const Comment = use('App/Models/Comment')
const User = use('App/Models/User')
const Mail = use('Mail')
const ProjectServices = use('App/Services/projectServices')
const MarkdownServices = use('App/Services/markdownServices')
const FileuploadServices = use('App/Services/fileuploadServices')
const TicketServices = use('App/Services/ticketServices')
const Moment = use('moment')

class TicketController {
  async index({ auth, view, response }) {
    const ticketsNeu = await TicketServices.ticketGroupedByStatus('Neu', auth.user.id)
    const ticketsAnerkannt = await TicketServices.ticketGroupedByStatus('Anerkannt', auth.user.id)
    const ticketsWarten = await TicketServices.ticketGroupedByStatus('Warten', auth.user.id)
    const ticketsFeedback = await TicketServices.ticketGroupedByStatus('Feedback', auth.user.id)
    const ticketsBearbeitung = await TicketServices.ticketGroupedByStatus('Bearbeitung', auth.user.id)

    const userProjects = await ProjectServices.getUserProjects(auth.user.id, 'open')

    return view.render('tickets.index', {
      priorities: priorities,
      ticketsNeu: ticketsNeu.toJSON(),
      ticketsAnerkannt: ticketsAnerkannt.toJSON(),
      ticketsWarten: ticketsWarten.toJSON(),
      ticketsFeedback: ticketsFeedback.toJSON(),
      ticketsBearbeitung: ticketsBearbeitung.toJSON(),
      userProjects: userProjects.toJSON()
    })
  }

  async projectIndex({ params, auth, view }) {
    const ticketsNeu = await TicketServices.ticketGroupedByStatusAndProject('Neu', auth.user.id, params.id)
    const ticketsAnerkannt = await TicketServices.ticketGroupedByStatusAndProject('Anerkannt', auth.user.id, params.id)
    const ticketsWarten = await TicketServices.ticketGroupedByStatusAndProject('Warten', auth.user.id, params.id)
    const ticketsFeedback = await TicketServices.ticketGroupedByStatusAndProject('Feedback', auth.user.id, params.id)
    const ticketsBearbeitung = await TicketServices.ticketGroupedByStatusAndProject('Bearbeitung', auth.user.id, params.id)

    const userProjects = await ProjectServices.getUserProjects(auth.user.id, 'open')

    return view.render('tickets.index', {
      priorities: priorities,
      ticketsNeu: ticketsNeu.toJSON(),
      ticketsAnerkannt: ticketsAnerkannt.toJSON(),
      ticketsWarten: ticketsWarten.toJSON(),
      ticketsFeedback: ticketsFeedback.toJSON(),
      ticketsBearbeitung: ticketsBearbeitung.toJSON(),
      userProjects: userProjects.toJSON()
    })
  }

  async show({ params, view, response }) {
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
      .with('comments')
      .with('project.members', (builder) => {
        builder.select('id', 'first_name', 'last_name')
      })
      .first()

    let comments = await Comment.query()
      .where('ticket_id', ticket.id)
      .select('id', 'body', 'created_at', 'author_id', 'attachments')
      .with('commentAuthor', (builder) => {
        builder.select('id', 'first_name', 'last_name', 'avatar')
      })
      .orderBy('created_at', 'desc')
      .fetch()

    let ticketAttachments = null
    if(ticket.attachments) {
      ticketAttachments = JSON.parse(ticket.attachments)
    }

    ticket.description = await MarkdownServices.convertToHtml(ticket.description, 'description')
    comments = await MarkdownServices.convertToHtml(comments.toJSON(), 'body')

    return view.render('tickets.show', {
      ticket: ticket.toJSON(),
      comments: comments,
      statuses: statuses,
      priorities: priorities,
      ticketAttachments: ticketAttachments
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
      priorities: priorities,
      impacts: impacts,
      reproducibles: reproducibles,
      projects: projects.toJSON()
    })
  }

  async store({ request, auth, session, response }) {
    const validation = await validateAll(request.all(), {
      subject: 'required',
      description: 'required',
      project: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

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

    try {
      // Sende eine Notifikation falls der Recipient NICHT der Author ist
      if(ticket.recipient_id != null && ticket.recipient_id != auth.user.id) {
        const recipient = await ticket.ticketRecipient().fetch()

        await Mail.send('emails.new_ticket_notification', ticket.toJSON(), message => {
          message
            .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
            .to(recipient.email)
            .subject(`Dir wurde ein neues Ticket [#${ticket.id}] zugewiesen.`)
        })
      }
    } catch (error) {
      console.log(error)
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

  async edit({ params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor', (builder) => {
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
      priorities: priorities,
      impacts: impacts,
      reproducibles: reproducibles,
      ticket: ticket.toJSON(),
      attachments: attachments,
      attachmentsCurrent: attachmentsCurrent,
      doneUntil: Moment(ticket.done_until).format('YYYY-MM-DD')
    })
  }

  async update({ params, auth, request, session, response }) {
    const validation = await validateAll(request.all(), {
      subject: 'required',
      description: 'required',
      time_expenses: 'number'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

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

      await Mail.send('emails.assigned_ticket_notification', ticket.toJSON(), message => {
        message
          .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
          .to(author.email)
          .subject(`Das Ticket [#${ticket.id}] wurde von ${recipient.first_name} ${recipient.last_name} übernommen.`)
      })
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

    ticket.status = request.input('status')

    await ticket.save()

    const author = await ticket.ticketAuthor().fetch()

    try {
      /* Informiere den Recipient, dass sich der Ticket-Status verändert hat.
      Informiere NICHT, wenn der Author die selbe Person wie der Recipient ist! */
      if(author.id != auth.user.id && ticket.status != 'Feedback' && ticket.status != 'Sistiert') {
        await Mail.send('emails.ticket_change_status_notification', ticket.toJSON(), message => {
          message
            .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
            .to(author.email)
            .subject(`Das Ticket [#${ticket.id}] wurde auf "${ticket.status}" gesetzt.`)
        })
      }
    } catch (error) {
      console.log(error)
    }

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

    await ticket.save()

    const author = await ticket.ticketAuthor().fetch()

    try {
      /* Informiere den Recipient, dass sich der Ticket-Status verändert hat.
      Informiere NICHT, wenn der Author die selbe Person wie der Recipient ist! */
      if(author.id != auth.user.id) {
        await Mail.send('emails.ticket_change_status_notification', ticket.toJSON(), message => {
          message
            .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
            .to(author.email)
            .subject(`Das Ticket [#${ticket.id}] wurde auf "${ticket.status}" gesetzt.`)
        })
      }
    } catch (error) {
      console.log(error)
    }

    return response.redirect('back')
  }

  async changeRecipient({ params, auth, request, session, response }) {
    const ticket = await Ticket.find(params.id)

    ticket.recipient_id = request.input('recipient_id')
    ticket.forwarder_id = auth.user.id

    await ticket.save()

    // Informiere den neuen Recipient, dass ihm ein Ticket zugewiesen wurde
    const recipient = await ticket.ticketRecipient().fetch()

    try {
      await Mail.send('emails.new_ticket_notification', ticket.toJSON(), message => {
        message
          .from('noreply@codiac.ch', 'codiac.ch Helpdesk')
          .to(recipient.email)
          .subject(`Dir wurde ein neues Ticket [#${ticket.id}] zugewiesen.`)
      })
    } catch (error) {
      console.log(error)
    }

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
    const validation = await validateAll(request.all(), {
      token: 'required',
      subject: 'required',
      description: 'required',
      priority: 'required',
      project: 'required',
      email: 'required'
    })

    if (validation.fails()) {
      return response.status(406).send(validation.messages())
    }

    const ticket = request.all()

    const user = await User.query()
      .where('email', ticket.email)
      .first()

    const project = await Project.query()
      .where('code', ticket.project)
      .first()

    if (user && project) {
      await Ticket.create({
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority,
        author_id: user.id,
        project_id: project.id
      })

      return response.status(200).send('Das Ticket wurde erfolgreich übermittelt.')
    }

    return response.status(500).send('Das Ticket konnte nicht erstellt werden weil entweder der User oder das Projekt nicht existieren.')
  }
}

module.exports = TicketController
