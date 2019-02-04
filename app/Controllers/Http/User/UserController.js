'use strict'

const Config = use('Config')
const { salutations } = Config.get('user')
const { validateAll } = use('Validator')
const User = use('App/Models/User')
const Event = use('Event')
const FileuploadServices = use('App/Services/fileuploadServices')

class UserController {
  async index({ view }) {
    const usersActive = await User.query()
      .select('id', 'first_name', 'last_name', 'profession', 'is_active', 'is_admin')
      .where('is_active', true)
      .orderBy('last_name', 'asc')
      .fetch()

    const usersInactive = await User.query()
      .select('id', 'first_name', 'last_name', 'profession', 'is_active', 'is_admin')
      .where('is_active', false)
      .orderBy('last_name', 'asc')
      .fetch()

    return view.render('users.index', {
      usersActive: usersActive.toJSON(),
      usersInactive: usersInactive.toJSON()
    })
  }

  async show({ params, view }) {
    const user = await User.query()
      .where('id', params.id)
      .with('lastLogin')
      .with('authorOfProjects', (builder) => {
        builder.select('id', 'author_id', 'title')
      })
      .with('memberInProjects', (builder) => {
        builder.select('id', 'title')
      })
      .first()

    return view.render('users.show', {
      user: user.toJSON()
    })
  }

  async create({ view }) {
    return view.render('users.create', {
      salutations: salutations
    })
  }

  async store({ request, session, response }) {
    // Validate
    const validation = await validateAll(request.all(), {
      salutation: 'required',
      first_name: 'required',
      last_name: 'required',
      email: 'required|email|unique:users, email',
      password: 'required|min:6'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password'])

      return response.redirect('back')
    }

    let tfaActive = request.input('tfa_active')
    tfaActive = (tfaActive == 'on')? true : false

    let isActive = request.input('is_active')
    isActive = (isActive == 'on')? true : false

    let isAdmin = request.input('is_admin')
    isAdmin = (isAdmin == 'on')? true : false

    let sendEmail = request.input('send_email')
    sendEmail = (sendEmail == 'on')? true : false

    // Create User
    const user = await User.create({
      salutation: request.input('salutation'),
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      profession: request.input('profession'),
      phone: request.input('phone'),
      mobile: request.input('mobile'),
      email: request.input('email'),
      password: request.input('password'),
      tfa_active: tfaActive,
      is_active: isActive,
      is_admin: isAdmin,
      locale: request.input('locale')
    })

    const file = request.file('avatar', {
      size: '1mb'
    })

    user.avatar = await FileuploadServices.storeSingle(
      file,
      'avatars',
      user
    )

    const password = request.input('password')

    await user.save()

    if(isActive && sendEmail) {
      Event.fire('new::user', { user, password })
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'Das Benutzerkonto wurde erfolgreich erstellt.'
      }
    })

    return response.route('usersShow', { id: user.id })
  }

  async edit({ params, view }) {
    const user = await User.find(params.id)
    return view.render('users.edit', {
      user: user,
      salutations: salutations
    })
  }

  async update({ params, request, session, response }) {
    const userId = params.id

    const validation = await validateAll(request.all(), {
      salutation: 'required',
      first_name: 'required',
      last_name: 'required',
      email: `required|email|min:6|unique:users, email, id, ${userId}`
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const user = await User.find(params.id)

    const file = request.file('avatar', {
      size: '1mb'
    })

    user.avatar = await FileuploadServices.storeSingle(
      file,
      'avatars',
      user
    )

    let isAdmin = request.input('is_admin')
    isAdmin = (isAdmin == 'on')? true : false

    let isActive = request.input('is_active')
    isActive = (isActive == 'on')? true : false

    let tfaActive = request.input('tfa_active')
    tfaActive = (tfaActive == 'on')? true : false

    user.salutation = request.input('salutation')
    user.first_name = request.input('first_name')
    user.last_name = request.input('last_name')
    user.profession = request.input('profession')
    user.phone = request.input('phone')
    user.mobile = request.input('mobile')
    user.email = request.input('email')
    user.is_admin = isAdmin
    user.is_active = isActive
    user.tfa_active = tfaActive,
    user.locale = request.input('locale')

    await user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Änderungen wurden erfolgreich übernommen.'
      }
    })

    return response.route('usersShow', { id: user.id })
  }
}

module.exports = UserController
