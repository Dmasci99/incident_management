/*
File name: users.server.routes.js
Author: Alex Andriishyn
Website: http://incident-management.azurewebsites.net/
File description: users routes
*/

'use strict';

var usersController = require('../controllers/users.server.controller.js'),
    passport = require('passport'),
    auth = require('../../config/auth.js');

module.exports = function(app) {

  app.route('/login')
     .get(usersController.renderLogin)
	   .post(usersController.login);

  app.route('/register')
     .get(usersController.renderRegister)
     .post(usersController.register);

  app.get('/logout', usersController.logout);

  // Common route for admins and users to GET index(admins) or profile(users) page
  app.get('/users', auth.requireAuth, usersController.renderUsers)
     .post('/users', auth.requireAuth, usersController.updateUser);

  // Admin route for a specific user profile
  app.get('/users/edit/:userId', auth.requireAuth, usersController.renderUpdateUser)
     .post('/users/edit/:userId', auth.requireAuth, usersController.updateUser);

  // Delete a user
  app.get('/users/delete/:userId', auth.requireAuth, usersController.deleteUser);
};
