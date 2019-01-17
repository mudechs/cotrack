'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LastLoginSchema extends Schema {
  up () {
    this.create('last_logins', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('last_logins')
  }
}

module.exports = LastLoginSchema
