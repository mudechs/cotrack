'use strict';

const Config = use('Config');
const {
  phases
} = Config.get('project');
const {
  statuses,
  priorities
} = Config.get('ticket');
const Project = use('App/Models/Project');
const Ticket = use('App/Models/Ticket');
const User = use('App/Models/User');
const TicketServices = use('App/Services/ticketServices');
const RandomString = require('random-string');
const Antl = use('Antl');

class ProjectController {
  async index({
    auth,
    view
  }) {
    let projectsActive = [];
    let projectsInactive = [];

    if (auth.user.is_admin) {
      projectsActive = await Project.query()
        .where('is_active', true)
        .with('projectAuthor', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .fetch();

      projectsInactive = await Project.query()
        .where('is_active', false)
        .with('projectAuthor', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .fetch();
    } else {
      projectsActive = await Project.query()
        .where('is_active', true)
        .andWhere(function () {
          this
            .where('author_id', auth.user.id)
            .orWhereHas('members', (builder) => {
              builder.where('user_id', auth.user.id);
            });
        })
        .with('projectAuthor', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .fetch();

      projectsInactive = await Project.query()
        .where('is_active', false)
        .andWhere(function () {
          this
            .where('author_id', auth.user.id)
            .orWhereHas('members', (builder) => {
              builder.where('user_id', auth.user.id);
            });
        })
        .with('projectAuthor', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .fetch();
    }

    return view.render('projects.index', {
      projectsActive: projectsActive.toJSON(),
      projectsInactive: projectsInactive.toJSON(),
      phases: phases[0][auth.user.locale]
    });
  }

  async show({
    auth,
    params,
    session,
    view,
    response
  }) {
    const project = await Project.query()
      .where('id', params.id)
      .with('projectAuthor', (builder) => {
        builder.select('id', 'first_name', 'last_name');
      })
      .with('members', (builder) => {
        builder.select('id', 'first_name', 'last_name', 'profession', 'avatar', 'is_available').orderBy('last_name', 'asc');
      })
      .first();

    if (project) {
      const statusesOpen = await TicketServices.ticketStatuses('open', auth.user.locale);
      const statusesClosed = await TicketServices.ticketStatuses('closed', auth.user.locale);

      const ticketsOpen = await Ticket.query()
        .where('project_id', project.id)
        .whereIn('status', statusesOpen)
        .with('ticketAuthor', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .with('ticketRecipient', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .orderBy('created_at', 'desc')
        .fetch();

      const ticketsClosed = await Ticket.query()
        .where('project_id', project.id)
        .whereIn('status', statusesClosed)
        .with('ticketAuthor', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .with('ticketRecipient', (builder) => {
          builder.select('id', 'first_name', 'last_name');
        })
        .orderBy('created_at', 'desc')
        .fetch();

      return view.render('projects.show', {
        project: project.toJSON(),
        ticketsOpen: ticketsOpen.toJSON(),
        ticketsClosed: ticketsClosed.toJSON(),
        phases: phases[0][auth.user.locale],
        statuses: statuses[0][auth.user.locale],
        priorities: priorities[0][auth.user.locale]
      });
    }

    session.flash({
      notification: {
        type: 'danger',
        message: 'Das Projekt kann nicht angezeigt werden.'
      }
    });

    return response.redirect('back');
  }

  async create({
    auth,
    view
  }) {
    const users = await User.query()
      .select('id', 'first_name', 'last_name')
      .orderBy('last_name', 'asc')
      .where('is_active', true)
      .fetch();

    return view.render('projects.create', {
      members: users.toJSON(),
      phases: phases[0][auth.user.locale]
    });
  }

  async store({
    request,
    auth,
    session,
    response
  }) {
    let isActive = request.input('is_active');
    isActive = (isActive == 'on') ? true : false;

    // Create Project
    const project = await Project.create({
      title: request.input('title'),
      description: request.input('description'),
      phase: request.input('phase'),
      is_active: isActive,
      author_id: auth.user.id,
      token: RandomString({
        length: 64
      })
    });

    await project.members().attach(request.input('members'));

    const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message8');

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    return response.route('projectsShow', {
      id: project.id
    });
  }

  async edit({
    auth,
    params,
    view
  }) {
    const project = await Project.query()
      .where('id', params.id)
      .with('members', (builder) => {
        builder.select('id', 'first_name', 'last_name')
          .where('is_active', true);
      })
      .with('versions')
      .first();

    const users = await User.query()
      .select('id', 'first_name', 'last_name')
      .where('is_active', true)
      .orderBy('last_name', 'asc')
      .fetch();

    return view.render('projects.edit', {
      project: project.toJSON(),
      users: users.toJSON(),
      phases: phases[0][auth.user.locale]
    });
  }

  async update({
    params,
    request,
    auth,
    session,
    response
  }) {
    const project = await Project.find(params.id);

    let isActive = request.input('is_active');
    isActive = (isActive == 'on') ? true : false;

    project.title = request.input('title');
    project.description = request.input('description');
    project.phase = request.input('phase');
    project.default_version = request.input('default_version');
    project.is_active = isActive;

    await project.save();

    await project.members().sync(request.input('members'));

    const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message2');

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    return response.route('projectsShow', {
      id: project.id
    });
  }
}

module.exports = ProjectController;
