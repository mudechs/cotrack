'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SettingSchema extends Schema {
  up() {
    this.table('settings', (table) => {
      table.string('contact_person');
      table.string('app_name');
    });
  }

  down() {
    this.table('settings', () => {
      // reverse alternations
    });
  }
}

module.exports = SettingSchema;
