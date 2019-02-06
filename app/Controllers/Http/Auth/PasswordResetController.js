'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Hash = use('Hash')
const Event = use('Event')
const Antl = use('Antl')

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

      const email = user.email
      const locale = user.locale

      // Send confirmation E-Mail
      Event.fire('new::passwordReset', { email, token, locale })

      // Show success Message
      const message = Antl.forLocale(request.globals.default_locale).formatMessage('messages.message15')

      session.flash({
        notification: {
          type: 'success',
          message: message
        }
      })

      return response.redirect('back')

    } catch (error) {
      const message = Antl.forLocale(request.globals.default_locale).formatMessage('messages.message16')

      session.flash({
        notification: {
          type: 'danger',
          message: message
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
        const message = Antl.forLocale(request.globals.default_locale).formatMessage('messages.message17')

        session.flash({
          notification: {
            type: 'danger',
            message: message
          }
        })

        return response.redirect('back')
      }

      user.password = await Hash.make(request.input('password'))

      await user.save()

      // delete the password token
      await PasswordReset.query().where('email', user.email).delete()

      const message = Antl.forLocale(request.globals.default_locale).formatMessage('messages.message18')

      session.flash({
        notification: {
          type: 'success',
          message: message
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
