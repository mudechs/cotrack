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
    salutation: 'Frau',
    first_name: 'Admin',
    last_name: 'Admin',
    profession: 'Administrator',
    phone: '',
    mobile: '',
    email: 'info@codiac.ch',
    password: 'Nkz8289TMU',
    is_active: true,
    is_admin: true
  }
})
