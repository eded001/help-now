const UserService = require('../services/user.service.temp');

const UserController = {
    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAllUsers(req, res) {
        const users = await UserService.getAllUsers();

        res.status(200).json(users);
    },

    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(Number(req.params.id));
            res.status(200).json(user);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const user = await UserService.updateUser(Number(req.params.id), req.body);
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            await UserService.deleteUser(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = UserController;