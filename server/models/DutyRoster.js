const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DutyRoster = sequelize.define('dutyroster', {
    roster_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PoliceStations',
            key: 'station_id'
        }
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'stationstaff',
            key: 'staff_id'
        }
    },
    duty_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duty_description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'dutyroster'
});

module.exports = DutyRoster;
