const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Victim = sequelize.define('victims', {
    victim_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    case_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cases',
            key: 'case_id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    contact_info: {
        type: DataTypes.STRING(255)
    },
    statement: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'victims'
});

module.exports = Victim;
