/*
Authors : Anthony Scinocco, Alex Andriishyn, Dan Masci, David Yu
Website : incident-management.azurewebsites.net

File : incident.server.routes.js
Description : Handles routing for all incident related url request 
*/



'use strict';

var incidentController = require('../controllers/incident.server.controller.js'),
		auth = require('../../config/auth.js');

module.exports = function(app) {
	app.get('/incident', auth.requireAuth, incidentController.dashboard);

	app.route('/incident/add')
		 .get(auth.requireAuth, incidentController.add)
		 .post(auth.requireAuth, incidentController.processAdd);

	app.route('/incident/update/:id')
		 .get(auth.requireAuth, auth.requireAdmin, incidentController.update)
		 .post(auth.requireAuth, incidentController.processUpdate);

	app.get('/incident/filter/:filter', auth.requireAuth, incidentController.dashboard);
};
