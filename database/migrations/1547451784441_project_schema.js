'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProjectSchema extends Schema {
  up() {
    this.create('projects', (table) => {
      table.increments();
      table.string('title');
      table.text('description');
      table.integer('phase', 5);
      table.boolean('is_active').defaultTo(1);
      table.integer('author_id').unsigned().references('id').inTable('users');
      table.string('token', 64).notNullable();
      table.string('default_version');
      table.timestamps();
    });
  }

  down() {
    this.drop('projects');
  }
}

module.exports = ProjectSchema;
