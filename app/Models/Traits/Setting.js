'use strict'

class Setting {
  async register () {
    const View = use('View')
    const Setting = use('App/Models/Setting')
    const settings = await Setting.query().first()
    View.global('globals', () => {
      if(settings) {
        return settings
      }
    })
  }
}

module.exports = Setting
