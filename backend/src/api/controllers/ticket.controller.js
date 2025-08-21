const { ticketSchema } = require('../models/ticket.model');
const TicketService = require('../services/ticket.service.js');

module.exports = {
    // cria um novo ticket
    async createTicket(req, res) {
        try {
            const { error, value: ticketData } = ticketSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const createdTicket = await TicketService.create(ticketData);
            return res.status(201).json({
                success: true,
                ticket: createdTicket
            });
        } catch (err) {
            console.error('Erro ao criar ticket:', err);
            return res.status(500).json({ error: 'Não foi possível criar o ticket.' });
        }
    },

    // lista os tickets
    async listTickets(req, res) {
        try {
            const tickets = await TicketService.getAll();
            return res.json({ success: true, tickets });
        } catch (err) {
            console.error('Erro ao listar tickets:', err);
            return res.status(500).json({ error: 'Não foi possível listar os tickets.' });
        }
    },

    // retorna um ticket específico por ID
    async getTicketById(req, res) {
        try {
            const { id } = req.params;
            const ticket = await TicketService.getById(parseInt(id));
            if (!ticket) return res.status(404).json({ error: 'Ticket não encontrado.' });

            return res.json({ success: true, ticket });
        } catch (err) {
            console.error('Erro ao buscar ticket:', err);
            return res.status(500).json({ error: 'Não foi possível buscar o ticket.' });
        }
    },

    // atualiza dados de um ticket existente
    async updateTicket(req, res) {
        try {
            const { id } = req.params;
            const { error, value: ticketUpdates } = ticketSchema.validate(req.body, { presence: 'optional' });
            if (error) return res.status(400).json({ error: error.details[0].message });

            const updatedTicket = await TicketService.update(parseInt(id), ticketUpdates);
            return res.json({ success: true, ticket: updatedTicket });
        } catch (err) {
            console.error('Erro ao atualizar ticket:', err);
            return res.status(500).json({ error: 'Não foi possível atualizar o ticket.' });
        }
    },

    // remove um ticket
    async deleteTicket(req, res) {
        try {
            const { id } = req.params;
            await TicketService.delete(parseInt(id));
            return res.json({ success: true, message: 'Ticket apagado com sucesso.' });
        } catch (err) {
            console.error('Erro ao apagar ticket:', err);
            return res.status(500).json({ error: 'Não foi possível apagar o ticket.' });
        }
    }
};