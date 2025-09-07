const AuthService = require('../services/auth.service');

const AuthController = {
    async register(req, res) {
        try {
            const user = await AuthService.register(req.body);
            return res.status(201).json({ success: true, message: 'Usuário registrado com sucesso', data: user });
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Falha ao registrar usuário', error: error.message });
        }
    },

    async login(req, res) {
        try {
            const user = await AuthService.login(req.body);
            return res.status(200).json({ success: true, message: 'Login realizado com sucesso', data: user });
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Falha no login', error: error.message });
        }
    },

    async updatePassword(req, res) {
        try {
            const user = await AuthService.updatePassword(req.body);
            return res.status(200).json({ success: true, message: 'Senha atualizada com sucesso', data: user });
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Falha ao atualizar senha', error: error.message });
        }
    },

    async authCheck(req, res) {
        if (req.session && req.session.user) {
            return res.status(200).json({
                authenticated: true,
                user: req.session.user
            });
        } else {
            return res.status(401).json({
                authenticated: false,
                error: 'Usuário não autenticado.'
            });
        }
    }
};

module.exports = AuthController;