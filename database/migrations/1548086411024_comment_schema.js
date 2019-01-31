'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.text('body').notNullable()
      table.json('attachments')
      table.integer('author_id').unsigned().references('id').inTable('users')
      table.integer('ticket_id').unsigned().references('id').inTable('tickets')
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
