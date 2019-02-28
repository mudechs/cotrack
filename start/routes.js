'use strict';

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
const Route = use('Route');

Route.get('/', 'DashboardController.index').middleware(['auth', 'mMode']).as('dashboard');
Route.on('/privacy-policy').render('auth.privacy_policy').middleware(['mMode']).as('privacyPolicy');
Route.get('register', 'Auth/RegisterController.showRegistrationForm').middleware(['mMode']);
Route.post('register', 'Auth/RegisterController.register').as('register').middleware(['mMode']);
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail').middleware(['mMode']);
Route.get('register/success', ({ view }) => {
  return view.render('auth.register_success');
})
  .middleware(['mMode'])
  .as('register.success');

Route.get('login', 'Auth/LoginController.showLoginForm').as('showLoginForm');
Route.post('login', 'Auth/LoginController.login').as('login').validator('LoginUser');
Route.get('login/:hash', 'Auth/LoginController.loginTokenForm').as('loginTokenForm');
Route.post('login/token', 'Auth/LoginController.loginToken').as('loginToken');
Route.get('logout', 'Auth/LogoutController.logout').middleware(['auth', 'mMode']).as('logout');
Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm').middleware(['mMode']).as('passwordResetForm');

Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail').middleware(['mMode']).as('passwordEmail');
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm').middleware(['mMode']);
Route.post('password/reset', 'Auth/PasswordResetController.reset').middleware(['mMode']).as('passwordResetStore');

Route.group(() => {
  Route.get('password/edit/:id', 'Auth/PasswordChangeController.edit').middleware(['userOA']).as('passwordEdit');
  Route.post('password/:id', 'Auth/PasswordChangeController.update').middleware(['userOA']).as('passwordUpdate').validator('PasswordUpdate');

  Route.get('users', 'User/UserController.index').middleware(['isAdmin']).as('usersIndex');
  Route.get('users/create', 'User/UserController.create').middleware(['isAdmin']).as('usersCreate');
  Route.get('users/show/:id', 'User/UserController.show').middleware(['userOA']).as('usersShow');
  Route.get('users/edit/:id', 'User/UserController.edit').middleware(['userOA']).as('usersEdit');
  Route.post('users/store', 'User/UserController.store').middleware(['isAdmin']).as('usersStore').validator('StoreUser');
  Route.post('users/update/:id', 'User/UserController.update').middleware(['userOA']).as('usersUpdate').validator('StoreUser');
  Route.post('users/availability/:id', 'User/UserController.userChangeAvailability').middleware(['userOA']).as('userChangeAvailability');

  Route.get('projects', 'Project/ProjectController.index').as('projectsIndex');
  Route.get('projects/create', 'Project/ProjectController.create').middleware(['isAdmin']).as('projectsCreate');
  Route.get('projects/show/:id', 'Project/ProjectController.show').middleware(['projectOAM']).as('projectsShow');
  Route.get('projects/edit/:id', 'Project/ProjectController.edit').middleware(['isAdmin']).as('projectsEdit');
  Route.post('projects/store', 'Project/ProjectController.store').middleware(['isAdmin']).as('projectsStore').validator('StoreProject');
  Route.post('projects/update/:id', 'Project/ProjectController.update').middleware(['isAdmin']).as('projectsUpdate').validator('StoreProject');

  Route.get('tickets', 'Ticket/TicketController.index').as('ticketsIndex');
  Route.get('tickets/p/:id', 'Ticket/TicketController.projectIndex').as('ticketsProjectIndex');
  Route.get('tickets/create', 'Ticket/TicketController.create').as('ticketsCreate');
  Route.get('tickets/show/:id', 'Ticket/TicketController.show').middleware(['ticketOFRAM']).as('ticketsShow'); // owner, forwarder, recipient, admin, project member
  Route.get('tickets/edit/:id', 'Ticket/TicketController.edit').middleware(['ticketOA']).as('ticketsEdit');
  Route.post('tickets/store', 'Ticket/TicketController.store').as('ticketsStore').validator('StoreTicket');
  Route.post('tickets/update/:id', 'Ticket/TicketController.update').middleware(['ticketOA']).as('ticketsUpdate').validator('UpdateTicket');
  Route.post('tickets/change/status/:id', 'Ticket/TicketController.changeStatus').as('ticketsChangeStatus');
  Route.post('tickets/reopen/:id', 'Ticket/TicketController.reopen').as('ticketsReopen');
  Route.post('tickets/change/dragged/status/:id', 'Ticket/TicketController.changeDraggedStatus').as('ticketsChangeDraggedStatus');
  Route.post('tickets/change/recipient/:id', 'Ticket/TicketController.changeRecipient').as('ticketsChangeRecipient');
  Route.post('tickets/assign/:id', 'Ticket/TicketController.assignToMe').as('ticketsAssignToMe');
  Route.post('tickets/comment/store/:id', 'Comment/CommentController.store').as('commentsStore').validator('StoreComment');
  Route.post('tickets/comment/update/:id', 'Comment/CommentController.update').as('commentsUpdate').validator('StoreComment');
}).middleware(['mMode', 'auth']);

// Error pages
Route.get('error-403', ({ view }) => {
  return view.render('errors/403');
})
  .middleware(['mMode'])
  .as('error403');

Route.get('error-503', ({ view }) => {
  return view.render('errors/503');
})
  .as('error503');

Route.group(() => {
  Route.get('settings', 'Setting/SettingController.index').as('settings.index');
  Route.get('settings/:id/edit', 'Setting/SettingController.edit').as('settings.edit');
  Route.post('settings/:id', 'Setting/SettingController.update').as('settings.update').validator('Settings');
})
  .middleware(['mMode', 'auth', 'isSuperAdmin', 'isAdmin']);

Route.group(() => {
  Route.post('user/restorepassword/:id', 'Auth/PasswordRestoreController.restorePassword').as('restorePassword');
}).middleware(['mMode', 'auth', 'isSuperAdmin']);

// Internal API
Route.get('api/tickets/projectMembers/:id', 'Ticket/TicketController.apiGetProjectMembers').middleware(['mMode', 'auth']);
Route.get('api/comments/:id', 'Comment/CommentController.apiGetComment').middleware(['mMode', 'auth']);
Route.get('api/versions/:id', 'Version/VersionController.show').middleware(['mMode','isAdmin']);
Route.post('api/versions/create/:id', 'Version/VersionController.create').middleware(['mMode', 'isAdmin']).as('versionsCreate');
Route.post('api/versions/delete/:id', 'Version/VersionController.delete').middleware(['mMode', 'isAdmin']);

// Public API
Route.post('api/public/tickets/create', 'Ticket/TicketController.apiPublicTicketCreate').middleware(['mMode', 'publicApi']);
Route.get('api/public/tickets/fetch', 'Ticket/TicketController.apiPublicTicketFetch').middleware(['mMode', 'publicApi']);
