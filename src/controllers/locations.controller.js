const db = require('../models');
const Users = db.users;
const Devices = db.devices;
const Locations = db.locations;

exports.get = async (req, res) => {

	const dateFrom = req.query.date ? new Date(req.query.date) : new Date();
	dateFrom.setMinutes(req.query.tz);
	const dateTo = new Date(dateFrom);
	dateTo.setMinutes(24 * 60);

	const last = new Date(req.query.last);

	const locations = await Locations.findAll({
		where: {
			userId: req.data.user.id,
			deviceId: req.query.deviceId,
			time: req.query.last ? {
				[db.Sequelize.Op.gte]: last.toISOString()
			} : {
				[db.Sequelize.Op.between]: [dateFrom.toISOString(), dateTo.toISOString()]
			},
		}
	});
	
	return res.json({ locations });
};

exports.create = async (req, res) => {

	if (!req.body) {
		return res.status(400).send({
			message: 'Content can not be empty!'
		});
	}

	if (!req.body.lat || !req.body.lng || !req.body.time) {
		return res.status(400).send({
			message: 'Params can not be empty!'
		});
	}

	let location = {
		latitude: req.body.lat,
		longitude: req.body.lng,
		time: new Date(req.body.time).toISOString(),
		deviceId: req.data.device.id,
		userId: req.data.user.id
	};

	const data = await Locations.create(location);

	res.json(data);
};

exports.delete = async (req, res) => {
	await Locations.destroy({
		truncate: true
	});
	res.json({});
}
