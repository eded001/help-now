const { DataTypes } = require('sequelize');
const sequelize = require('../utils/conn');

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
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type_account: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'client',
    }
}, {
    tableName: 'users',
    timestamps: false, // se quiser createdAt/updatedAt, muda para true
});

module.exports = User;