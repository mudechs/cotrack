'use strict';

const Setting = use('App/Models/Setting');
const Antl = use('Antl');

class SettingController {
  async index({ view }) {
    const settings = await Setting.first();

    if (settings) {
      return view.render('settings.index', {
        settings: settings.toJSON()
      });
    }

    return view.render('settings.create');

  }

  async edit({ params, view }) {
    const settings = await Setting.find(params.id);

    return view.render('settings.edit', {
      settings: settings.toJSON()
    });
  }

  async update({ params, request, auth, session, response }) {
    const setting = await Setting.find(params.id);

    let allowRegistration = request.input('allow_registration');
    allowRegistration = (allowRegistration == 'on') ? true : false;

    let maintenanceMode = request.input('maintenance_mode');
    maintenanceMode = (maintenanceMode == 'on') ? true : false;

    setting.company = request.input('company');
    setting.contact_person = request.input('contact_person');
    setting.address = request.input('address');
    setting.zip_code = request.input('zip_code');
    setting.area = request.input('area');
    setting.city = request.input('city');
    setting.country = request.input('country');
    setting.phone = request.input('phone');
    setting.mobile = request.input('mobile');
    setting.email = request.input('email');
    setting.www = request.input('www');
    setting.default_locale = request.input('default_locale');
    setting.allow_registration = allowRegistration;
    setting.maintenance_mode = maintenanceMode;
    setting.app_name = request.input('app_name');

    await setting.save();

    const message = Antl.forLocale(auth.user.locale).formatMessage('messages.message2');

    session.flash({
      notification: {
        type: 'success',
        message: message
      }
    });

    return response.route('settings.index');
  }
}

module.exports = SettingController;
