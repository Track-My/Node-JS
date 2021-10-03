module.exports = app => {
	const devices = require('../controllers/devices.controller.js');

	var router = require('express').Router();

	const jwt = require('../middlewares/jwt.middleware.js');
	router.use(jwt.required)

	router.get('/', devices.get);
	router.put('/:id', devices.edit);

	app.use('/api/devices', router);
};
