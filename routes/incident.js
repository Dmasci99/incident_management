/**
 * Anthony Scinocco
 * incident-management.azurewebsites.net
 * November 23, 2015
 * Handles routing for all incident related url request
 */
var express = require('express'),
	router = express.Router(),
    auth = require('../config/auth.js');

//grab the incident controller
var incidentController = require('../controller/incident');

//grab the ticket dashboard
router.get('/', auth.requireAuth, incidentController.dashboard);

//add a ticket
router.get('/add', auth.requireAuth, incidentController.add);

//process added ticket
router.post('/add', auth.requireAuth, incidentController.processAdd);

//display a ticket update view based on ticket id
router.get('/update/:id', auth.requireAuth, incidentController.update);

//process the updated ticket
router.post('/update/:id', auth.requireAuth, incidentController.processUpdate);

//allow the user to delete tickets based on id
router.get('/delete/:id?', auth.requireAuth, incidentController.delete);

//this handles filter tickets
router.get('/filter/:filter', auth.requireAuth, incidentController.dashboard);

module.exports = router;