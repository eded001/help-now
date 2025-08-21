const Joi = require('joi');

const ticketSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(500).required(),
    status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED').optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
    category: Joi.string().min(3).max(30).required(),
    created_by_id: Joi.number().integer().required(),
    assigned_to_id: Joi.number().integer().optional(),
    resolved_at: Joi.date().optional()
});

module.exports = { ticketSchema };