const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Case = sequelize.define('cases', {
    case_id: {
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
    fir_number: {
        type: DataTypes.STRING(50),
        unique: true
    },
    registration_date: {
        type: DataTypes.DATE
    },
    case_type: {
        type: DataTypes.STRING(100)
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING(50)
    },
    reporting_officer: {
        type: DataTypes.STRING(255)
    }
}, {
    timestamps: true,
    tableName: 'cases'
});

module.exports = Case;
