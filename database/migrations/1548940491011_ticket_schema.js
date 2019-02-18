'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TicketSchema extends Schema {
  up() {
    this.table('tickets', (table) => {
      table.string('impact');
      table.string('reproducible');
    });
  }

  down() {
    this.table('tickets', (table) => {
      // reverse alternations
    });
  }
}

module.exports = TicketSchema;
