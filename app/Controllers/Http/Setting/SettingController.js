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

  }
}

module.exports = SettingController
