const UserService = require('../services/UserService');

module.exports = {
    async create(req, res) {
        try {
            const { name, username } = req.body;
            if (!name || !username) {
                return res.status(400).json({ error: 'Nome e username são obrigatórios.' });
            }

            const exists = await UserService.findByUsername(username);
            if (exists) {
                return res.status(409).json({ error: 'Usuário já existe.' });
            }

            const newUser = await UserService.create({ name, username });
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erro no create: ', error);
            res.status(500).json({ error: error.message });
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

            return res.status(200).json({ message: 'Login bem-sucedido', user });
        } catch (error) {
            console.error('Erro no login: ', error);
            res.status(500).json({ error: error.message });
        }
    }
};