const express = require('express');
const db = require('./src/models');
var cors = require('cors');

process.env.TZ = 'UTC' 

db.sequelize.sync({ }).then(_ => {

	const app = express();

	app.use(express.json())
	
	app.use(cors());


	require('./src/routes/users.route')(app);
	require('./src/routes/locations.route')(app);
	require('./src/routes/devices.route')(app);

	app.listen(3001, function() {
		  console.log('App listening on port 3001!');
	});

});
