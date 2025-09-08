const ticketService = require('../services/ticket.service');
const { ticketSchema } = require('../models/ticket.model');
const { successResponse, errorResponse } = require('../../../utils/response');

// create
async function create(req, res) {
    try {
        const { error, value } = ticketSchema.validate(req.body);
        if (error) {
            const messages = error.details.map(data => data.message);
            return res.status(400).json({ success: false, message: 'Dados inválidos', errors: messages });
        }

        const ticketData = {
            ...value,
            created_by_username: req.user.username,
        };

        const ticket = await ticketService.create(ticketData);
        return successResponse(res, ticket, 201);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// list
async function list(req, res) {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.category) filters.category = req.query.category;

        const tickets = await ticketService.list(filters);
        return successResponse(res, tickets);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// get by id
async function getById(req, res) {
    try {
        const ticket = await ticketService.getById(parseInt(req.params.id));
        if (!ticket || ticket.length === 0) return res.status(404).json({ success: false, message: 'Ticket não encontrado' });
        return successResponse(res, ticket[0]);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// get by username
async function getByUsername(req, res) {
    try {
        if (!req.session.user || !req.session.user.username) {
            return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        }

        const tickets = await ticketService.getByUsername(req.session.user.username);
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ success: false, message: 'Nenhum ticket encontrado para este usuário' });
        }

        return successResponse(res, tickets);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// update
async function update(req, res) {
    try {
        const ticket = await ticketService.update(req.params.id, req.body);
        return successResponse(res, ticket);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// assign
async function assign(req, res) {
    try {
        const { assigned_to_username } = req.body;
        if (!assigned_to_username) {
            return res.status(400).json({ success: false, message: 'assigned_to_username é obrigatório' });
        }

        const ticket = await ticketService.assign(req.params.id, assigned_to_username);
        return successResponse(res, ticket);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// get all unassigned tickets
async function getUnassigned(req, res) {
    try {
        const tickets = await ticketService.getUnassigned();
        return successResponse(res, tickets);
    } catch (error) {
        return errorResponse(res, error);
    }
}

// delete
async function remove(req, res) {
    try {
        await ticketService.remove(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return errorResponse(res, error);
    }
}

module.exports = { create, list, getById, getByUsername, update, assign, getUnassigned, remove };