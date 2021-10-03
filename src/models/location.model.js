module.exports = (sequelize, Sequelize) => {
	const Location = sequelize.define('Location', {
		latitude: {
			type: Sequelize.DOUBLE,
		},
		longitude: {
			type: Sequelize.DOUBLE
		},
		time: {
			type: Sequelize.STRING
		},
	}, {
		timestamps: false
	});

	return Location;
};
