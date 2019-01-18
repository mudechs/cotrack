'use strict'

const { statuses, priorities } = require('../../../../config/ticket')
const { validateAll } = use('Validator')
const Project = use('App/Models/Project')
const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')
const markdown = require('showdown')

class ProjectController {
  async index({ auth, view }) {
    let projects = []

    if(auth.user.is_admin) {
      projects = await Project.query()
        .where('is_active', true)
        .with('projectAuthor')
        .fetch()
    } else {
      projects = await Project.query()
        .where('is_active', true)
        .where('author_id', auth.user.id)
        .orWhereHas('members', (builder) => {
          builder.where('user_id', auth.user.id)
        })
        .with('projectAuthor')
        .fetch()
    }

    return view.render('projects.index', {
      projects: projects.toJSON()
    })
  }

  async show({ params, auth, session, view, response }) {
    const project = await Project.query()
      .where('id', params.id)
      .where('author_id', auth.user.id)
      .orWhereHas('members', (builder) => {
        builder.where('project_id', params.id)
      })
      .with('projectAuthor')
      .with('members')
      .first()

    if(project) {
      const statusesOpen = await Ticket.ticketStatuses(statuses, 'open')
      const ticketsOpen = await Ticket.query()
        .where('project_id', project.id)
        .whereIn('status', statusesOpen)
        .orderBy('created_at', 'desc')
        .fetch()

      const statusesClosed = await Ticket.ticketStatuses(statuses, 'closed')
      const ticketsClosed = await Ticket.query()
        .where('project_id', project.id)
        .whereIn('status', statusesClosed)
        .orderBy('created_at', 'desc')
        .fetch()

      const descriptionMd = project.description
      const md = new markdown.Converter()

      project.description = md.makeHtml(descriptionMd)

      return view.render('projects.show', {
        project: project.toJSON(),
        ticketsOpen: ticketsOpen.toJSON(),
        ticketsClosed: ticketsClosed.toJSON(),
        priorities: priorities
      })
    }

    session.flash({
      notification: {
        type: 'error',
        message: 'Das Projekt kann nicht angezeigt werden.'
      }
    })

    return response.redirect('back')
  }

  async create({ view }) {
    const members = await User.query()
      .select('id', 'first_name', 'last_name')
      .whereNot('is_active', false)
      .fetch()

    return view.render('projects.create', {
      members: members.toJSON()
    })
  }

  async store({ request, auth, session, response }) {
    const validation = await validateAll(request.all(), {
      title: 'required',
      description: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    let isActive = request.input('is_active')
    isActive = (isActive == 'on')? true : false;

    // Create Project
    const project = await Project.create({
      title: request.input('title'),
      description: request.input('description'),
      is_active: isActive,
      author_id: auth.user.id
    })

    await project.members().attach(request.input('members'))

    session.flash({
      notification: {
        type: 'success',
        message: 'Das Projekt wurde erfolgreich angelegt.'
      }
    })

    return response.route('projectsShow', { id: project.id })
  }

  async edit({ params, view }) {
    const project = await Project.query()
      .where('id', params.id)
      .with('members')
      .first()

    const users = await User.query()
      .select('id', 'first_name', 'last_name')
      .whereNot('is_active', false)
      .fetch()

    return view.render('projects.edit', {
      project: project.toJSON(),
      users: users.toJSON()
    })
  }

  async update({ params, request, session, response }) {

    const validation = await validateAll(request.all(), {
      title: 'required',
      description: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const project = await Project.find(params.id)

    let isActive = request.input('is_active')
    isActive = (isActive == 'on')? true : false;

    project.title = request.input('title')
    project.description = request.input('description')
    project.is_active = isActive

    await project.save()

    await project.members().sync(request.input('members'))

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Änderungen wurden erfolgreich übernommen.'
      }
    })

    return response.route('projectsShow', { id: project.id })
  }
}

module.exports = ProjectController
