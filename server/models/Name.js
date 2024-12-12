const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Name = sequelize.define('Name', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    romanizedName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    devanagariName: {
        type: DataTypes.STRING
    },
    phoneticCode: {
        type: DataTypes.STRING
    },
    caseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('victim', 'witness', 'suspect', 'reporter'),
        allowNull: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            type: 'FULLTEXT',
            fields: ['romanizedName', 'devanagariName']
        }
    ]
});

module.exports = Name;
