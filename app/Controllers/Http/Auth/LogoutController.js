'use strict';

class LogoutController {
  async logout({
    auth,
    response
  }) {
    await auth.logout();

    return response.redirect('/login');
  }
}

module.exports = LogoutController;
