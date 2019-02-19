'use strict';

const Config = use('Config');
const { salutations } = Config.get('user');
const { validateAll } = use('Validator');
const User = use('App/Models/User');
const randomString = require('random-string');
const Event = use('Event');
const Antl = use('Antl');

class RegisterController {
  showRegistrationForm({ request, view, response }) {
    if (request.globals.allow_registration) {
      return view.render('auth.register', {
        salutations: salutations[0]['en']
      });
    } else {
      return response.route('error403');
    }
  }

  async register({ request, session, response }) {
    // Validate
    const validation = await validateAll(request.all(), {
      salutation: 'required',
      first_name: 'required',
      last_name: 'required',
      email: 'required|email|unique:users, email',
      password: 'required|min:6'
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password']);

      return response.redirect('back');
    }

    let tfaActive = request.input('tfa_active');
    tfaActive = (tfaActive == 'on') ? true : false;

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
      confirmation_token: randomString({
        length: 64
      })
    });

    // Send confirmation E-Mail
    Event.fire('new::userRegistration', {
      user
    });

    // Show success Message
    const message = Antl.forLocale(request.globals.default_locale).formatMessage('messages.message19');

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    return response.route('register.success');
  }

  async confirmEmail({ params, request, session, response }) {
    const user = await User.findBy('confirmation_token', params.token);

    user.confirmation_token = null;
    user.is_active = true;

    await user.save();

    const message = Antl.forLocale(request.globals.default_locale).formatMessage('messages.message20');

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    return response.redirect('/login');
  }
}

module.exports = RegisterController;
