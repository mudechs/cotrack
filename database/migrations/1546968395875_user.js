'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table.integer('salutation', 5).notNullable();
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('profession', 254);
      table.string('phone', 100);
      table.string('mobile', 100);
      table.string('email', 254).notNullable().unique();
      table.string('password', 254).notNullable();
      table.string('avatar');
      table.string('confirmation_token');
      table.boolean('is_active').defaultTo(0);
      table.boolean('is_admin').defaultTo(0);
      table.boolean('is_superadmin').defaultTo(0);
      table.boolean('tfa_active').defaultTo(0);
      table.string('locale', 5).defaultTo('de');
      table.boolean('is_available').defaultTo(1);
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
