'use strict';

const User = use('App/Models/User');
const Hash = use('Hash');
const Antl = use('Antl');

class PasswordChangeController {
  async edit({ params, view }) {
    const user = await User.find(params.id);
    return view.render('auth.password_edit', {
      user: user
    });
  }

  async update({ params, request, auth, session, response }) {
    // formdaten auslesen
    const password_current = request.input('password_current');

    // aktuelle userdaten holen
    const user = await User.find(params.id);

    // prüfen ob aktuelles passwort korrekt ist
    const passwordVerified = await Hash.verify(password_current, user.password);

    if (!passwordVerified) {
      const message = Antl.forLocale(auth.user.locale).formatMessage(
        'messages.message13'
      );

      session.flash({
        notification: {
          type: 'danger',
          message: message
        }
      });

      return response.redirect('back');
    }

    // hashen und setzen des neuen passwortes
    user.password = await Hash.make(request.input('password'));

    // speichern des neuen passwortes
    await user.save();

    // meldung zeigen
    const message = Antl.forLocale(auth.user.locale).formatMessage(
      'messages.message14'
    );

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });
    // weiterleiten
    return response.route('usersShow', {
      id: user.id
    });
  }
}

module.exports = PasswordChangeController;
