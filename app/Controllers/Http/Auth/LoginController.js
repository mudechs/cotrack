'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const Token = use('App/Models/Token')
const LastLogin = use('App/Models/LastLogin')
const Hash = use('Hash')
const randomString = require('random-string')
const Mail = use('Mail')

class LoginController {
  showLoginForm({ view }) {
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    // Validate
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

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
              token: randomString({ length: 6 }),
              type: '2FA'
            })

            // aus token einen hash machen
            const hash = await Hash.make(token)

            const fullName = user.first_name + ' ' + user.last_name

            const mailData = {
              fullName,
              token
            }

            // mail mit token senden
            await Mail.send('emails.confirm_2fa_login', mailData, message => {
              message
                .to(user.email)
                .from('noreply@codiac.ch')
                .subject('Dein 2FA-Code zum Anmelden')
            })

            // auf token formular weiterleiten
            return response.route('loginTokenForm', { 'hash': hash })

          } else {
            // Login the user
            await auth.remember(!!remember).login(user)

            session.flash({
              notification: {
                type: 'success',
                message: `Willkommen ${user.first_name}!`
              }
            })

            return response.route('dashboard')
          }
        }
      }

      // Error message if login fails
      session.flash({
        notification: {
          type: 'danger',
          message: `Die Anmeldung ist fehlgeschlagen. Überprüfe bitte ob deine E-Mail Adresse aktiviert wurde, oder ob deine Angaben korrekt sind.`
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
      session.flash({
        notification: {
          type: 'danger',
          message: `Der eingegebene Code ist ungültig.`
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
            message: `Willkommen ${user.first_name}!`
          }
        })

        return response.route('dashboard')
      }
    }

    // Error message if login fails
    session.flash({
      notification: {
        type: 'danger',
        message: `Die Anmeldung ist fehlgeschlagen.`
      }
    })

    return response.route('showLoginForm')
  }
}

module.exports = LoginController
