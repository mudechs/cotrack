'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('is_superadmin').defaultTo(0)
    })
  }

  down () {
    this.table('users', () => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
