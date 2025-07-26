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
    }
};