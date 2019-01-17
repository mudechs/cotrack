'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')

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
