const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'CLIENT', 'SUPPORT').optional(),
});

module.exports = {
    userSchema,
};