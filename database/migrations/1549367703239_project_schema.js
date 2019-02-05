'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectSchema extends Schema {
  up () {
    this.table('projects', (table) => {
      table.string('token', 64).notNullable()
    })
  }

  down () {
    this.table('projects', () => {
      // reverse alternations
    })
  }
}

module.exports = ProjectSchema
