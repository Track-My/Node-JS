module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('User', {
		email: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING
		},
	}, {
		timestamps: false
	});

	return User;
};
