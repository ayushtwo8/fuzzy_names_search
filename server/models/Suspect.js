const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Suspect = sequelize.define('suspects', {
    suspect_id: {
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
    alias: {
        type: DataTypes.STRING(255)
    },
    description: {
        type: DataTypes.TEXT
    },
    criminal_record: {
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.STRING(50)
    }
}, {
    timestamps: true,
    tableName: 'suspects'
});

module.exports = Suspect;
