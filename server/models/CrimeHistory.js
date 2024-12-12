const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CrimeHistory = sequelize.define('crimehistory', {
    record_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    suspect_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'suspects',
            key: 'suspect_id'
        }
    },
    description: {
        type: DataTypes.TEXT
    },
    date_of_crime: {
        type: DataTypes.DATE
    },
    conviction_status: {
        type: DataTypes.STRING(50)
    }
}, {
    timestamps: true,
    tableName: 'crimehistory'
});

module.exports = CrimeHistory;
