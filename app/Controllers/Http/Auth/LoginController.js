'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Setting = use('App/Models/Setting')
const Token = use('App/Models/Token')
const LastLogin = use('App/Models/LastLogin')
const Hash = use('Hash')
const RandomString = require('random-string')
const Event = use('Event')
const Antl = use('Antl')

class LoginController {
  showLoginForm({ view }) {
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    try {
      // Get form data
      const { email, password, remember } = request.all()

      // Get user based on form data
      const user = await User.query()
        .where('email', email)
        .where('is_active', true)
        .first()

      // Verify password
      if(user) {
        const passwordVerified = await Hash.verify(password, user.password)

        if(passwordVerified) {
          // Create last login entry
          const lastLogin = await LastLogin.findBy('user_id', user.id)

          if (lastLogin) {
            await lastLogin.delete()
          }

          await LastLogin.create({
            user_id: user.id
          })

          // Check if user has 2FA active
          if(user.tfa_active) {
            // token generieren (6-stellig)
            await Token.query()
              .where('user_id', user.id)
              .delete()

            const { token } = await Token.create({
              user_id: user.id,
              token: RandomString({ length: 6 }),
              type: '2FA'
            })

            // aus token einen hash machen
            const hash = await Hash.make(token)

            const email = user.email
            const locale = user.locale

            // mail mit token senden
            Event.fire('new::login', { token, email, locale })

            // auf token formular weiterleiten
            return response.route('loginTokenForm', { 'hash': hash })

          } else {
            // Login the user
            await auth.remember(!!remember).login(user)

            const settings = await Setting.query().first()

            if(settings.email) {
              session.flash({
                notification: {
                  type: 'success',
                  message: `Hey ${user.first_name}!`
                }
              })

              return response.route('dashboard')
            }
            else {
              if(auth.user.is_admin == true) {
                const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message9', { firstName: user.first_name })

                session.flash({
                  notification: {
                    type: 'success',
                    message: message
                  }
                })

                return response.route('settings.edit')
              }
              else {
                return response
                  .status(403)
                  .send('Die App wurde noch nicht konfiguriert. Bitte logge dich mit einem Admin-Konto ein. :-)')
              }
            }
          }
        }
      }

      // Error message if login fails
      const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message10')

      session.flash({
        notification: {
          type: 'danger',
          message: message
        }
      })

      return response.redirect('back')
    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: `${error}`
        }
      })

      return response.redirect('back')
    }
  }

  loginTokenForm({ params, view }) {
    const hash = decodeURIComponent(params.hash)

    return view.render('auth.login_token', {
      hash: hash
    })
  }

  async loginToken({ request, auth, session, response }) {
    // Validate
    const validation = await validate(request.only('token'), {
      token: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const hash = request.input('hash')
    const token = await Token.findBy('token', request.input('token'))

    if(!token) {
      const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message11')
      session.flash({
        notification: {
          type: 'danger',
          message: message
        }
      })

      return response.redirect('back')
    }

    const user = await User.query()
      .where('id', token.user_id)
      .where('is_active', true)
      .first()

    if(user) {
      const tokenVerified = await Hash.verify(token.token, hash)

      if(tokenVerified) {
        token.delete()
        // Login the user
        await auth.login(user)

        session.flash({
          notification: {
            type: 'success',
            message: `Hey ${user.first_name}!`
          }
        })

        return response.route('dashboard')
      }
    }

    // Error message if login fails
    const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message12')
    session.flash({
      notification: {
        type: 'danger',
        message: message
      }
    })

    return response.route('showLoginForm')
  }
}

module.exports = LoginController
