'use strict'

const { validate } = use('Validator')
const Hash = use('Hash')
const RandomString = require('random-string')
const Antl = use('Antl')
const User = use('App/Models/User')
const Event = use('Event')

class PasswordRestoreController {
  async restorePassword({params, request, auth, session, response }) {
    // Validate
    const validation = await validate(request.only('password'), {
      password: 'required|min:6'
    })

    if (validation.fails()) {
      return response.status(406).send('ERROR: Missing password')
    }

    const superadminPassword = request.input('password')

    // superadmin passwort prüfen
    const passwordVerified = await Hash.verify(superadminPassword, auth.user.password)

    if(passwordVerified) {
      const user = await User.find(params.id)

      if(user) {
        const password = RandomString({ length: 10 })

        user.password = password

        await user.save()

        Event.fire('new::user', { user, password })

        const message = Antl.forLocale(user.locale).formatMessage('static.new_password_sent')

        session.flash({
          notification: {
            type: 'success',
            message: message
          }
        })

        return response.route('usersShow', { id: user.id })
      }
    }

    // Error message if password check fails
    const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message13')

    session.flash({
      notification: {
        type: 'danger',
        message: message
      }
    })
  }
}

module.exports = PasswordRestoreController
