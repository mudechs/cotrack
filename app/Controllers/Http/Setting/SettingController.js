'use strict'

const Setting = use('App/Models/Setting')

class SettingController {
  async index({ view }) {
    const settings = await Setting.first()

    return view.render('settings.index', {
      settings: settings.toJSON()
    })

  }

  async edit({ params, view }) {
    const settings = await Setting.find(params.id)

    return view.render('settings.edit', {
      settings: settings.toJSON()
    })
  }

  async update({ params, request, session, response }) {
    const settings = await Setting.find(params.id)

    let allowRegistration = request.input('allow_registration')
    allowRegistration = (allowRegistration == 'on')? true : false

    let maintenanceMode = request.input('maintenance_mode')
    maintenanceMode = (maintenanceMode == 'on')? true : false

    settings.company = request.input('company')
    settings.address = request.input('address')
    settings.zip_code = request.input('zip_code')
    settings.area = request.input('area')
    settings.city = request.input('city')
    settings.country = request.input('country')
    settings.phone = request.input('phone')
    settings.mobile = request.input('mobile')
    settings.email = request.input('email')
    settings.www = request.input('www')
    settings.default_locale = request.input('default_locale')
    settings.allow_registration = allowRegistration
    settings.maintenance_mode = maintenanceMode

    await settings.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Die Änderungen wurden erfolgreich übernommen.'
      }
    })

    return response.route('settingsShow')
  }
}

module.exports = SettingController
