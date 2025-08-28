const Joi = require('joi');

const ticketSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(500).required(),
    status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'RESOLVED').optional(),
    category: Joi.string().required(),
    created_by_username: Joi.string().min(3).max(50).required(),
    assigned_to_username: Joi.string().min(3).max(50).optional(),
    resolved_at: Joi.date().optional()
});

module.exports = { ticketSchema };