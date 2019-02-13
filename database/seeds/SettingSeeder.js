'use strict'

/*
|--------------------------------------------------------------------------
| SettingSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class SettingSeeder {
  async run () {
    await Factory
      .model('App/Models/Setting')
      .create()
  }
}

module.exports = SettingSeeder
