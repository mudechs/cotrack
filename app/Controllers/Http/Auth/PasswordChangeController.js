'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class PasswordChangeController {
  async edit({ params, view }) {
    const user = await User.find(params.id)
    return view.render('auth.password_edit', {
      user: user
    })
  }

  async update ({ params, request, session, response }) {
    // validierung der felder
    const validation = await validateAll(request.all(), {
      password_current: 'required',
      password: 'required|confirmed'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    // formdaten auslesen
    const password_current = request.input('password_current')

    // aktuelle userdaten holen
    const user = await User.find(params.id)

    // prüfen ob aktuelles passwort korrekt ist
    const passwordVerified = await Hash.verify(password_current, user.password)

    if (!passwordVerified) {
      session.flash({
        notification: {
          type: 'danger',
          message: `Das angegebene Passwort ist falsch.`
        }
      })

      return response.redirect('back')
    }

    // hashen und setzen des neuen passwortes
    user.password = await Hash.make(request.input('password'))

    // speichern des neuen passwortes
    await user.save()

    // meldung zeigen
    session.flash({
      notification: {
        type: 'success',
        message: 'Das Passwort wurde erfolgreich geändert.'
      }
    })
    // weiterleiten
    return response.route('usersShow', { id: user.id })
  }
}

module.exports = PasswordChangeController
