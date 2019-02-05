'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', async () => {
  return {
    salutation: 'Herr',
    first_name: 'Superadmin',
    last_name: 'Superadmin',
    profession: 'Superadministrator',
    phone: '',
    mobile: '',
    email: 'info@codiac.ch',
    password: 'mfc9Cxs6EdKTt33G',
    is_active: true,
    is_admin: true,
    is_superadmin: true
  }
})

Factory.blueprint('App/Models/Setting', async () => {
  return {
    company: 'De-Giuli [Custom Websolutions]',
    address: 'Raiweg 2',
    zip_code: '8108',
    area: 'ZH',
    city: 'Dällikon',
    country: 'Schweiz',
    phone: '+41 79 297 57 00',
    mobile: '+41 79 297 57 00',
    email: 'info@codiac.ch',
    www: 'https://www.codiac.ch',
    default_locale: 'de',
    allow_registration: '0',
    maintenance_mode: '0'
  }
})
