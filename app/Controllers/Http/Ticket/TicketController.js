'use strict'

const { statuses, priorities } = require('../../../../config/ticket')
const { validateAll } = use('Validator')
const Ticket = use('App/Models/Ticket')
const Project = use('App/Models/Project')
const markdown = require('showdown')

class TicketController {
  async show({ params, view }) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .with('ticketAuthor')
      .with('ticketRecipient')
      .with('project')
      .first()

    const descriptionMd = ticket.description
    const md = new markdown.Converter()

    ticket.description = md.makeHtml(descriptionMd)

    return view.render('tickets.show', {
      ticket: ticket.toJSON(),
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

  async changeStatus({ params, request, session, response }) {
    const ticket = await Ticket.find(params.id)

    ticket.status = request.input('status')

    await ticket.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Status wurde erfolgreich geändert.'
      }
    })

    return response.route('ticketsShow', { id: ticket.id })
  }

  // API Calls
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
}

module.exports = TicketController
