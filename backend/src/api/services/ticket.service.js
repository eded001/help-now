const prisma = require('../../../prisma/client');
const userService = require('./user.service');

async function list(filters) {
    return prisma.ticket.findMany({
        where: { ...filters },
        include: { created_by: true, assigned_to: true }
    });
}

async function create(data) {
    return prisma.ticket.create({
        data
    });
}

async function update(id, data) {
    const allowedFields = ['title', 'status', 'category', 'priority', 'resolved_at'];
    const updateData = {};

    for (const key of allowedFields) {
        if (data[key] !== undefined) updateData[key] = data[key];
    }

    return prisma.ticket.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: { created_by: true, assigned_to: true }
    });
}

async function assign(id, assigned_to_username) {
    const user = await userService.getByUsername(assigned_to_username);
    if (!user) throw new Error('Usuário não encontrado');

    return prisma.ticket.update({
        where: { id: parseInt(id) },
        data: { assigned_to_username: assigned_to_username },
async function getById(id) {
    return prisma.ticket.findUnique({
        where: { id: parseInt(id) },
        include: { created_by: true, assigned_to: true }
    });
}

async function remove(id) {
    return prisma.ticket.delete({ where: { id: parseInt(id) } });
}

module.exports = { list, create, update, assign, remove };