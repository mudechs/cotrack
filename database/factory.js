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
    first_name: 'Omar',
    last_name: 'De-Giuli',
    profession: 'Webentwickler',
    phone: '+41 44 745 77 77',
    mobile: '+41 79 297 57 00',
    email: 'omar@meantime.ch',
    password: '1234',
    is_active: true,
    is_admin: true
  }
})
