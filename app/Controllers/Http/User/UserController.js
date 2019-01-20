'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')

class UserController {
  async index({ view }) {
    const users = await User.all()

    return view.render('users.index', {
      users: users.toJSON()
    })
  }

  async show({ params, view }) {
    const user = await User.query()
      .where('id', params.id)
      .with('lastLogin')
      .with('authorOfProjects')
      .with('memberInProjects')
      .first()

    return view.render('users.show', {
      user: user.toJSON()
    })
  }

  async create({ view }) {
    return view.render('users.create')
  }

  async store({ request, session, response }) {
    // Validate
    const validation = await validateAll(request.all(), {
      first_name: 'required',
      last_name: 'required',
      email: 'required|email|unique:users, email',
      password: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password'])

      return response.redirect('back')
    }

    let tfaActive = request.input('tfa_active')
    tfaActive = (tfaActive == 'on')? true : false;

    let isActive = request.input('is_active')
    isActive = (isActive == 'on')? true : false;

    let isAdmin = request.input('is_admin')
    isAdmin = (isAdmin == 'on')? true : false;

    // Create User
    const user = await User.create({
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      profession: request.input('profession'),
      phone: request.input('phone'),
      mobile: request.input('mobile'),
      email: request.input('email'),
      password: request.input('password'),
      tfa_active: tfaActive,
      is_active: isActive,
      is_admin: isAdmin
    })

    // Send confirmation E-Mail
    await Mail.send('emails.user_credentials', user.toJSON(), message => {
      message
        .to(user.email)
        .from('no-reply@codiacs.ch')
        .subject('Willkommen bei CoTrack!')
    })

    // Show success Message
    session.flash({
      notification: {
        type: 'success',
        message: 'Das Konto wurde erfolgreich erstellt.'
      }
    })

    return response.route('usersShow', { id: user.id })
  }

  async edit({ params, view }) {
    const user = await User.find(params.id)
    return view.render('users.edit', {
      user: user
    })
  }

  async update({ params, request, session, response }) {
    const userId = params.id

    const validation = await validateAll(request.all(), {
      first_name: 'required',
      last_name: 'required',
      email: `required|email|unique:users, email, id, ${userId}`
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const user = await User.find(params.id)

    let isAdmin = request.input('is_admin')
    isAdmin = (isAdmin == 'on')? true : false;

    let tfaActive = request.input('tfa_active')
    tfaActive = (tfaActive == 'on')? true : false;

    user.first_name = request.input('first_name')
    user.last_name = request.input('last_name')
    user.profession = request.input('profession')
    user.phone = request.input('phone')
    user.mobile = request.input('mobile')
    user.email = request.input('email')
    user.is_admin = isAdmin
    user.tfa_active = tfaActive

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
