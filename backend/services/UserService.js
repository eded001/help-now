const UserModel = require('../models/UserModel');

module.exports = {
    async create({ name, username }) {
        if (!name || !username) {
            throw new Error('Name e username são obrigatórios');
        }

        const exists = await UserModel.findOne({ where: { username } });

        if (exists) {
            throw new Error('Este username já está em uso');
        }

        const newUser = await UserModel.create({ name, username });
        return newUser;
    },

    async findByUsername(username) {
        if (!username) {
            throw new Error('Username é obrigatório');
        }

        const user = await UserModel.findOne({ where: { username } });
        return { name: user.name };
    }
};