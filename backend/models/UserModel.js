const { DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'users',
    timestamps: false,     // se quiser createdAt/updatedAt, muda para true
});

module.exports = User;