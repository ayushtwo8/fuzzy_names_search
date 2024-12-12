const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Conviction = sequelize.define('convictions', {
    conviction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    case_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cases',
            key: 'case_id'
        }
    },
    suspect_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'suspects',
            key: 'suspect_id'
        }
    },
    conviction_date: {
        type: DataTypes.DATE
    },
    punishment_details: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'convictions'
});

module.exports = Conviction;
