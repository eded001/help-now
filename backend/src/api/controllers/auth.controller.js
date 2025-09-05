const AuthService = require('../services/auth.service');

const AuthController = {
    async register(req, res) {
        try {
            const user = await AuthService.register(req.body);
            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    async login(req, res) {
        try {
            const user = await AuthService.login(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return res.status(401).json({ error: err.message });
        }
    },

    async updatePassword(req, res) {
        try {
            const user = await AuthService.updatePassword(req.body);
            return res.status(200).json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}

module.exports = AuthController;