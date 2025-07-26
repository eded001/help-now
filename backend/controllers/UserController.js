const UserService = require('../services/UserService');

module.exports = {
    async create(req, res) {
        try {
            const { name, username } = req.body;

            if (!name || !username) {
                return res.status(400).json({ error: 'Nome e username são obrigatórios.' });
            }

            const newUser = await UserService.create({ name, username });
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erro no create: ', error);
            res.status(500).json({ error: error.message, stack: error.stack });
        }
    },

    async login(req, res) {
        try {
            const { username } = req.body;

            if (!username) {
                return res.status(400).json({ error: 'Username é obrigatório.' });
            }

            const user = await UserService.findByUsername(username);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Inicia sessão
            req.session.user = user;

            return res.status(200).json({ message: 'Login bem-sucedido', user });
        } catch (error) {
            console.error('Erro no login: ', error);
            res.status(500).json({ error: error.message, stack: error.stack });
        }
    },

    async authCheck(req, res) {
        if (req.session.user) {
            return res.status(200).json({ authenticated: true, user: req.session.user });
        } else {
            return res.status(401).json({ authenticated: false });
        }
    },

    async logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.error('Erro ao encerrar a sessão: ', err);
                return res.status(500).json({ error: 'Erro ao fazer logout' });
            }

            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logout realizado com sucesso' });
        });
    }
};