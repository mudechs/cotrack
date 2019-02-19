'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class VersionSchema extends Schema {
  up() {
    this.create('versions', (table) => {
      table.increments();
      table.string('title').notNullable();
      table.integer('project_id').unsigned().references('id').inTable('projects');
      table.timestamps();
    });
  }

  down() {
    this.drop('versions');
  }
}

module.exports = VersionSchema;
