const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PoliceStation = sequelize.define('policestations', {
    station_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    location: {
        type: DataTypes.TEXT
    },
    contact_number: {
        type: DataTypes.STRING(15)
    },
    jurisdiction_area: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'policestations'
});

module.exports = PoliceStation;
