const Sequelize = require('sequelize');
const config = require('../config/db.config.js');

const sequelize = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model.js')(sequelize, Sequelize);
db.devices = require('./device.model.js')(sequelize, Sequelize);
db.locations = require('./location.model.js')(sequelize, Sequelize);

db.users.belongsToMany(db.devices, { 
    through: 'User_Device', 
    foreignKey: {
        name: 'userId',
        allowNull: false,
    }, 
    timestamps: false,  
});
db.devices.belongsToMany(db.users, { 
    through: 'User_Device', 
    foreignKey: {
        name: 'deviceId',
        allowNull: false,
    }, 
    timestamps: false,  
});

db.devices.hasMany(db.locations, {
    foreignKey: {
        name: 'deviceId',
        allowNull: false,
    },
});
db.locations.belongsTo(db.devices, {
    foreignKey: {
        name: 'deviceId',
        allowNull: false,
    },
});

db.users.hasMany(db.locations, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
});
db.locations.belongsTo(db.users, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
});

module.exports = db;
