const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BailRecord = sequelize.define('bailrecords', {
    bail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    suspect_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Suspects',
            key: 'suspect_id'
        }
    },
    case_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cases',
            key: 'case_id'
        }
    },
    bail_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2)
    },
    surety_details: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'bailrecords'
});

module.exports = BailRecord;
