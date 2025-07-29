module.exports = {
    dashboard: (req, res) => {
        res.json({ message: 'Bem-vindo ao painel de administração!' });
    },

    getUsers: (req, res) => {
        // exemplo
        const users = [
            { id: 1, username: 'usuario1' },
            { id: 2, username: 'usuario2' },
        ];
        res.json(users);
    },
};