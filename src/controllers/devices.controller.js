const db = require('../models');
const Users = db.users;
const Devices = db.devices;
const Locations = db.locations;

exports.get = async (req, res) => {

	const user = await Users.findByPk(req.data.user.id);

	const devices = await user.getDevices({
		joinTableAttributes: []
	})

	return res.json({ devices });
};

exports.edit = async (req, res) => {

	const device = await Devices.findByPk(req.params.id)

	device.name = req.body.name;

	await device.save();

	return res.json({ device });
};
