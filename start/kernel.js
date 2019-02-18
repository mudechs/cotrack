'use strict';

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server');

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/AuthInit',
  'App/Middleware/ConvertEmptyStringsToNull',
  'App/Middleware/TemplateHelper',
  'App/Middleware/Setting'
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  mMode: 'App/Middleware/MaintenanceMode',
  authenticated: 'App/Middleware/Authenticated',
  guest: 'Adonis/Middleware/AllowGuestOnly',
  publicApi: 'App/Middleware/PublicApiAuth',
  userOA: 'App/Middleware/UserOA',
  projectOAM: 'App/Middleware/ProjectOAM',
  ticketOFRAM: 'App/Middleware/TicketOFRAM',
  ticketOA: 'App/Middleware/TicketOA',
  isAdmin: 'App/Middleware/IsAdmin',
  isSuperAdmin: 'App/Middleware/IsSuperAdmin'
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors'
];

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware);
