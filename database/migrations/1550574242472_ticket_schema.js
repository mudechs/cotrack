'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TicketSchema extends Schema {
  up () {
    this.table('tickets', (table) => {
      table.string('affected_version');
      table.string('resolved_version');
    });
  }

  down () {
    this.table('tickets', (table) => {
      // reverse alternations
    });
  }
}

module.exports = TicketSchema;
