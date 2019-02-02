'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Hash = use('Hash')
const Event = use('Event')

class PasswordResetController {
  showLinkRequestForm ({ view }) {
    return view.render('auth.password_reset_email')
  }

  async sendResetLinkEmail ({ request, session, response }) {
    const validation = await validate(request.only('email'), {
      email: 'required|email'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    try {
      const user = await User.findBy('email', request.input('email'))

      await PasswordReset.query()
        .where('email', user.email)
        .delete()

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString({ length: 40 })
      })

      const fullName = user.first_name + ' ' + user.last_name
      const email = user.email

      // Send confirmation E-Mail
      Event.fire('new::passwordReset', { fullName, email, token })

      // Show success Message
      session.flash({
        notification: {
          type: 'success',
          message: 'Ein Link zum zurücksetzen deines Passwortes wurde an deine E-Mail Adresse verschickt.'
        }
      })

      return response.redirect('back')

    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Ups, diese E-Mail Adresse scheint ungültig zu sein.'
        }
      })

      return response.redirect('back')
    }
  }

  showResetForm ({ params, view }) {
    return view.render('auth.password_reset', { token: params.token })
  }

  async reset ({ request, session, response }) {
    const validation = await validateAll(request.all(), {
      token: 'required',
      email: 'required|email',
      password: 'required|confirmed'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password', 'password_confirmation'])

      return response.redirect('back')
    }

    try {
      const user = await User.findBy('email', request.input('email'))

      const token = await PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

      if (!token) {
        session.flash({
          notification: {
            type: 'danger',
            message: 'Ups, das Passwortrücksetzungs-Token scheint ungültig zu sein.'
          }
        })

        return response.redirect('back')
      }

      user.password = await Hash.make(request.input('password'))

      await user.save()

      // delete the password token
      await PasswordReset.query().where('email', user.email).delete()

      session.flash({
        notification: {
          type: 'success',
          message: 'Das Passwort wurde erfolgreich zurückgesetzt.'
        }
      })

      return response.redirect('/login')

    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Ups, diese E-Mail Adresse scheint ungültig zu sein.'
        }
      })

      return response.redirect('back')
    }
  }
}

module.exports = PasswordResetController
