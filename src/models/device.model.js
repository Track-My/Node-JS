module.exports = (sequelize, Sequelize) => {
	const Device = sequelize.define('Device', {
		name: {
			type: Sequelize.STRING,
		},
		type: {
			type: Sequelize.STRING,
		},
		uuid: {
			type: Sequelize.STRING,
		},
	}, {
		timestamps: false
	});

	return Device;
};
