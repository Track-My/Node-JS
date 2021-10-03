module.exports = app => {
	const locations = require('../controllers/locations.controller.js');

	var router = require('express').Router();

	const jwt = require('../middlewares/jwt.middleware.js');
	router.use(jwt.required)

	router.get('/', locations.get);
	router.post('/', locations.create);
	router.delete('/', locations.delete);

	app.use('/api/locations', router);
};
