'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TicketSchema extends Schema {
  up() {
    this.create('tickets', (table) => {
      table.increments();
      table.string('subject', 100);
      table.text('description');
      table.integer('author_id').unsigned().references('id').inTable('users');
      table.integer('forwarder_id').unsigned().references('id').inTable('users');
      table.integer('recipient_id').unsigned().references('id').inTable('users');
      table.integer('status', 5).defaultsTo(1);
      table.integer('priority', 5).defaultsTo(1);
      table.decimal('time_expenses').defaultsTo('0.00');
      table.datetime('done_until');
      table.json('attachments');
      table.integer('project_id').unsigned().references('id').inTable('projects');
      table.integer('impact', 5);
      table.integer('reproducible', 5);
      table.string('affected_version');
      table.string('resolved_version');
      table.timestamps();
    });
  }

  down() {
    this.drop('tickets');
  }
}

module.exports = TicketSchema;
