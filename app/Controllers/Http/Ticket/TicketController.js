'use strict'

const Config = use('Config')
const { statuses, priorities } = Config.get('ticket')
const { validateAll } = use('Validator')
const Ticket = use('App/Models/Ticket')
const Project = use('App/Models/Project')
const User = use('App/Models/User')
const markdown = require('showdown')
const Mail = use('Mail')
const Helpers = use('Helpers')

class TicketController {
  async show({ params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor')
      .with('ticketRecipient')
      .with('ticketForwarder')
      .first()

    const project = await Project.query()
      .where('id', ticket.project_id)
      .with('members')
      .first()

    const descriptionMd = ticket.description
    const md = new markdown.Converter()

    ticket.description = md.makeHtml(descriptionMd)

    return view.render('tickets.show', {
      ticket: ticket.toJSON(),
      project: project.toJSON(),
      statuses: statuses
    })
  }

  async create({ view }) {
    const projects = await Project.query()
      .select('id', 'title')
      .where('is_active', true)
      .fetch()

    return view.render('tickets.create', {
      statuses: statuses,
      priorities: priorities,
      projects: projects.toJSON()
    })
  }

  async store({ request, auth, session, response }) {
    const validation = await validateAll(request.all(), {
      subject: 'required',
      description: 'required'
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
      author_id: auth.user.id,
      project_id: request.input('project'),
      recipient_id: request.input('recipient')
    })

    const attachments = request.file('attachments')

    await attachments.moveAll(Helpers.publicPath(`uploads/tickets/${ticket.id}`), (file) => {
      return {
        name: `${new Date().getTime()}.${file.subtype}`
      }
    })

    if (!attachments.movedAll()) {
      return attachments.errors()
    }

    ticket.attachments = JSON.stringify(attachments)

    await ticket.save()

    // Sende eine Notifikation falls der Recipient NICHT der Author isgt
    if(ticket.recipient_id != auth.user.id) {
      const recipient = await ticket.ticketRecipient().fetch()

      await Mail.send('emails.new_ticket_notification', ticket.toJSON(), message => {
        message
          .from('no-reply@codiacs.ch')
          .to(recipient.email)
          .subject(`Dir wurde ein neues Ticket [#${ticket.id}] zugewiesen.`)
      })
    }

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
      .with('ticketAuthor')
      .first()

    const projects = await Project.query()
      .select('id', 'title')
      .where('is_active', true)
      .fetch()

    return view.render('tickets.edit', {
      priorities: priorities,
      projects: projects.toJSON(),
      ticket: ticket.toJSON()
    })
  }

  async update({ params, auth, request, session, response }) {
    const validation = await validateAll(request.all(), {
      subject: 'required',
      description: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const ticket = await Ticket.find(params.id)

    ticket.subject = request.input('subject'),
    ticket.description = request.input('description'),
    ticket.priority = request.input('priority'),
    ticket.author_id = auth.user.id,
    ticket.project_id = request.input('project'),
    ticket.recipient_id = request.input('recipient')

    await ticket.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Änderungen wurden erfolgreich übernommen.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  async assignToMe({ params, auth, request, session, response }) {
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
          .from('no-reply@codiacs.ch')
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

    /* Informiere den Recipient, dass sich der Ticket-Status verändert hat.
    Informiere NICHT, wenn der Author die selbe Person wie der Recipient ist! */
    if(author.id != auth.user.id) {
      await Mail.send('emails.ticket_change_status_notification', ticket.toJSON(), message => {
        message
          .from('no-reply@codiacs.ch')
          .to(author.email)
          .subject(`Das Ticket [#${ticket.id}] wurde auf "${ticket.status}" gesetzt.`)
      })
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Status wurde erfolgreich geändert.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  async changeRecipient({ params, auth, request, session, response }) {
    const ticket = await Ticket.find(params.id)

    ticket.recipient_id = request.input('recipient_id')
    ticket.forwarder_id = auth.user.id

    await ticket.save()

    // Informiere den neuen Recipient, dass ihm ein Ticket zugewiesen wurde
    const recipient = await ticket.ticketRecipient().fetch()

    await Mail.send('emails.new_ticket_notification', ticket.toJSON(), message => {
      message
        .from('no-reply@codiacs.ch')
        .to(recipient.email)
        .subject(`Dir wurde ein neues Ticket [#${ticket.id}] zugewiesen.`)
    })

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
