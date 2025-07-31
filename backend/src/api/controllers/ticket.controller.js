const TicketService = require('../services/TicketService');

module.exports = {
    async create(req, res) {
        try {
            const { title, description } = req.body;
            const clientId = req.session.user?.id;

            if (!clientId) {
                return res.status(401).json({ error: 'Usuário não autenticado.' });
            }
            if (!title || !description) {
                return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
            }

            const ticket = await TicketService.create({ title, description, clientId });
            res.status(201).json(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar chamado.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const ticket = await TicketService.findById(Number(id));
            if (!ticket) {
                return res.status(404).json({ error: 'Chamado não encontrado.' });
            }
            res.json(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar chamado.' });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const allowedStatuses = ['open', 'in_progress', 'closed'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ error: 'Status inválido.' });
            }

            const ticket = await TicketService.updateStatus(Number(id), status);
            res.json(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar status.' });
        }
    },
};