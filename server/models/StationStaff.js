const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StationStaff = sequelize.define('stationstaff', {
    staff_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'policestations',
            key: 'station_id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rank: {
        type: DataTypes.STRING(100)
    },
    contact_number: {
        type: DataTypes.STRING(15)
    },
    assigned_duties: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'stationstaff'
});

module.exports = StationStaff;
