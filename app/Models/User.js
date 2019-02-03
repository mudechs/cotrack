'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Setting')
  }

  static get dates() {
    return super.dates.concat(['last_login_at'])
  }

  static castDates(field, value) {
    if (field === 'created_at' || field === 'updated_at' || field === 'last_login_at') {
      return value.format('DD.MM.YY')
    }
    return super.formatDates(field, value)
  }

  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Collects the successful logins of a user
   *
   * @method lastLogins
   *
   * @return {Object}
   */
  lastLogin() {
    return this.hasOne('App/Models/LastLogin')
  }

  /**
   * @method authorOfProjects
   *
   * @return {Object}
   */
  authorOfProjects() {
    return this.hasMany('App/Models/Project', 'id', 'author_id')
  }

  /**
   * @method memberInProjects
   *
   * @return {Object}
   */
  memberInProjects() {
    return this.belongsToMany('App/Models/Project').pivotTable('project_users')
  }

  /**
   * @method authorOfTickets
   *
   * @return {Object}
   */
  authorOfTickets() {
    return this.hasMany('App/Models/Ticket', 'id', 'author_id')
  }

  /**
   * @method forwarderOfTickets
   *
   * @return {Object}
   */
  forwarderOfTickets() {
    return this.hasMany('App/Models/Ticket', 'id', 'forwarder_id')
  }

  /**
   * @method recipientOfTickets
   *
   * @return {Object}
   */
  recipientOfTickets() {
    return this.hasMany('App/Models/Ticket', 'id', 'recipient_id')
  }

  /**
   * @method authorOfComments
   *
   * @return {Object}
   */
  authorOfComments() {
    return this.hasMany('App/Models/Comment', 'id', 'author_id')
  }
}

module.exports = User
