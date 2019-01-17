'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = require('random-string')
const Mail = use('Mail')

class RegisterController {
  showRegistrationForm ({ view }) {
    return view.render('auth.register')
  }

  async register ({ request, session, response }) {

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
      confirmation_token: randomString({ length: 40 })
    })

    // Send confirmation E-Mail
    await Mail.send('emails.confirm_registration', user.toJSON(), message => {
      message
        .to(user.email)
        .from('no-reply@codiacs.ch')
        .subject('Bitte bestätige deine E-Mail Adresse')
    })

    // Show success Message
    session.flash({
      notification: {
        type: 'success',
        message: 'Das Konto wurde erfolgreich erstellt. Eine E-Mail wurde verschickt um das Konto zu aktivieren.'
      }
    })

    return response.redirect('back')
  }

  async confirmEmail ({ params, session, response }) {
    const user = await User.findBy('confirmation_token', params.token)

    user.confirmation_token = null
    user.is_active = true

    await user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Die E-Mail Adresse wurde bestätigt.'
      }
    })

    return response.redirect('/login')
  }
}

module.exports = RegisterController
