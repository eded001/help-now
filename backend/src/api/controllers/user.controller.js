const { userSchema } = require('../models/user.model');
const UserService = require('../services/user.service');

module.exports = {
    async register(req, res) {
        try {
            const { error, value } = userSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { username, name, password, department, role } = value;
            const newUser = await UserService.create({ username, name, password, department, role });

            const { password: _, ...userWithoutPassword } = newUser;
            req.session.user = userWithoutPassword;

            res.status(201).json({ success: true });
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(409).json({ error: 'Username já existe.' });
            }

            console.error(error);
            res.status(500).json({ error: 'Erro interno.' });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username e senha são obrigatórios.' });
            }

            const user = await UserService.findByUsername(username);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const isValid = await UserService.verifyPassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }

            const { password: _, ...userWithoutPassword } = user;
            req.session.user = userWithoutPassword;

            res.status(201).json({ success: true, user: userWithoutPassword });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno.' });
        }
    },

    async logout(req, res) {
        req.session.destroy(error => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erro ao fazer logout.' });
            }

            res.clearCookie('connect.sid');
            res.status(201).json({ success: true });
        });
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