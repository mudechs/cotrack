'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'DashboardController.index').middleware(['auth']).as('dashboard')

Route.get('register', 'Auth/RegisterController.showRegistrationForm').middleware(['authenticated'])
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')

Route.get('login', 'Auth/LoginController.showLoginForm').middleware(['authenticated']).as('showLoginForm')
Route.post('login', 'Auth/LoginController.login').as('login')
Route.get('login/:hash', 'Auth/LoginController.loginTokenForm').as('loginTokenForm')
Route.post('login/token', 'Auth/LoginController.loginToken').as('loginToken')
Route.get('logout', 'Auth/LogoutController.logout').middleware(['auth']).as('logout')

Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm').as('passwordReset')
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
Route.post('password/reset', 'Auth/PasswordResetController.reset')
Route.get('password/edit/:id', 'Auth/PasswordChangeController.edit').middleware(['auth']).as('passwordEdit')
Route.post('password/:id', 'Auth/PasswordChangeController.update').middleware(['auth']).as('passwordUpdate')

Route.get('users', 'User/UserController.index').middleware(['auth']).as('usersIndex')
Route.get('users/show/:id', 'User/UserController.show').middleware(['auth']).as('usersShow')
Route.get('users/edit/:id', 'User/UserController.edit').middleware(['auth']).as('usersEdit')
Route.post('users/update/:id', 'User/UserController.update').middleware(['auth']).as('usersUpdate')

Route.get('projects', 'Project/ProjectController.index').middleware(['auth']).as('projectsIndex')
Route.get('projects/create', 'Project/ProjectController.create').middleware(['auth']).as('projectsCreate')
Route.get('projects/show/:id', 'Project/ProjectController.show').middleware(['auth']).as('projectsShow')
Route.get('projects/edit/:id', 'Project/ProjectController.edit').middleware(['auth']).as('projectsEdit')
Route.post('projects/store', 'Project/ProjectController.store').middleware(['auth']).as('projectsStore')
Route.post('projects/update/:id', 'Project/ProjectController.update').middleware(['auth']).as('projectsUpdate')

Route.get('tickets', 'Ticket/TicketController.index').middleware(['auth']).as('ticketsIndex')
Route.get('tickets/create', 'Ticket/TicketController.create').middleware(['auth']).as('ticketsCreate')
Route.get('tickets/show/:id', 'Ticket/TicketController.show').middleware(['auth']).as('ticketsShow')
Route.get('tickets/edit/:id', 'Ticket/TicketController.edit').middleware(['auth']).as('ticketsEdit')
Route.post('tickets/store', 'Ticket/TicketController.store').middleware(['auth']).as('ticketsStore')
Route.post('tickets/update/:id', 'Ticket/TicketController.update').middleware(['auth']).as('ticketsUpdate')
Route.post('tickets/change/status/:id', 'Ticket/TicketController.changeStatus').middleware(['auth']).as('ticketsChangeStatus')
Route.post('tickets/change/recipient/:id', 'Ticket/TicketController.changeRecipient').middleware(['auth']).as('ticketsChangeRecipient')

Route.get('api/tickets/projectMembers/:id', 'Ticket/TicketController.apiGetProjectMembers').middleware(['auth'])