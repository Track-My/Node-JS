const db = require('../models');
const Users = db.users;
const Devices = db.devices;
const jwt = require('jsonwebtoken');
const jwtblacklist = require('jwt-blacklist');

const blacklist = new jwtblacklist.BlackList({
	daySize: 10000,
	errorRate: 0.001,
});

exports.register = async (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: 'Content can not be empty!'
		});
	}

	if (!req.body.email || req.body.email === '' ||
		!req.body.password || req.body.password === '') {
		return res.status(400).send({
			message: 'Params can not be empty!'
		});
	}

	const user = {
		email: req.body.email,
		password: req.body.password,
	};

	if (await Users.findOne({ 
		where: { 
			email: user.email,
		},
	})) {
		return res.status(403).send({
			message: 'User already exists'
		});
	}

	await Users.create(user);
	
	return res.json({});
};


exports.authenticate = async (req, res) => {

    if (!req.body) {
		return res.status(400).send({
			message: 'Content can not be empty!'
		});
	}

	if (!req.body.credentials || !req.body.device ||
		!req.body.credentials.email || req.body.credentials.email === '' ||
		!req.body.credentials.password || req.body.credentials.password === '' ||
		!req.body.device.name || req.body.device.name === '' ||
		!req.body.device.type || req.body.device.type === '' ||
		!req.body.device.uuid || req.body.device.uuid === '') {
		return res.status(400).send({
			message: 'Params can not be empty!'
		});
	}

	const credentials = req.body.credentials;
	let device = req.body.device;
	
	const user = await Users.findOne({ 
		where: {
			email: credentials.email, 
			password: credentials.password
		},
		attributes: {
			exclude: ['password']
		},
	});
    
	if (!user) {
		return res.status(403).send({
			message: 'Forbidden'
		});
    }

	const deviceOld = await Devices.findOne({ 
		where: {
			uuid: device.uuid
		},
	});

	if (deviceOld) {
		await deviceOld.addUser(user);
		device = deviceOld;
	} else {
		device = await user.createDevice(device);
	}
    
	const token = jwt.sign({ data: { user, device } }, 'yt6r5478rt87god938gf9h34f3', { expiresIn: '24H' });
	const refreshToken = jwt.sign({ data: { user, device } }, 'yt6r5478rt87god938gf9h34f3', { expiresIn: '30d' });
	
    return res.json({ user, device, token, refreshToken });
};

exports.refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken
    if (refreshToken && !(await blacklist.has(refreshToken))) {
        jwt.verify(refreshToken, "yt6r5478rt87god938gf9h34f3", (err, payload) => {
            if (err) {
                return res.status(403).send({
                    message: 'Forbidden'
                })
            }

			blacklist.add(req.body.refreshToken);

            const { user, device } = payload.data
            const token = jwt.sign({ data: { user, device } }, 'yt6r5478rt87god938gf9h34f3', { expiresIn: '24H' });
			const refreshToken = jwt.sign({ data: { user, device } }, 'yt6r5478rt87god938gf9h34f3', { expiresIn: '30d' });
    		return res.json({ token, refreshToken });
        })
    } else {
        return res.status(403).send({
			message: 'Forbidden'
		})
    }
};
