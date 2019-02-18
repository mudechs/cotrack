'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SettingSchema extends Schema {
  up() {
    this.create('settings', (table) => {
      table.increments();
      table.string('company', 100);
      table.string('address', 100);
      table.string('zip_code', 20);
      table.string('area', 50);
      table.string('city', 100);
      table.string('country', 100);
      table.string('phone', 20);
      table.string('mobile', 20);
      table.string('email', 100);
      table.string('www', 100);
      table.string('default_locale', 5);
      table.boolean('allow_registration').defaultTo(0);
      table.boolean('maintenance_mode').defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop('settings');
  }
}

module.exports = SettingSchema;
