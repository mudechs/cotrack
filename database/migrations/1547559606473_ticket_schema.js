'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up () {
    this.create('tickets', (table) => {
      table.increments()
      table.string('subject', 100)
      table.text('description')
      table.integer('author_id').unsigned().references('id').inTable('users')
      table.integer('forwarder_id').unsigned().references('id').inTable('users')
      table.integer('recipient_id').unsigned().references('id').inTable('users')
      table.string('status').defaultsTo('Neu')
      table.string('priority').defaultsTo('Normal')
      table.text('attachments')
      table.integer('project_id').unsigned().references('id').inTable('projects')
      table.timestamps()
    })
  }

  down () {
    this.drop('tickets')
  }
}

module.exports = TicketSchema
