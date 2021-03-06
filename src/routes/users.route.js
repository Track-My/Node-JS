module.exports = app => {
	const users = require('../controllers/users.controller.js');

	var router = require('express').Router();

	router.post('/register', users.register);
	router.post('/authenticate', users.authenticate);
	router.post('/refresh', users.refresh);

	app.use('/api/users', router);
};
