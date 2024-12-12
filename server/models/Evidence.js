const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Evidence = sequelize.define('evidence', {
    evidence_id: {
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
    description: {
        type: DataTypes.TEXT
    },
    storage_location: {
        type: DataTypes.STRING(255)
    },
    chain_of_custody: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'evidence'
});

module.exports = Evidence;
