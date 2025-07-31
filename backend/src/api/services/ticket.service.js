const prisma = require('../../../prisma/client');

module.exports = {
    async create({ title, description, clientId }) {
        return prisma.ticket.create({
            data: {
                title,
                description,
                clientId,
                status: 'open',
            },
        });
    },

    async findById(id) {
        return prisma.ticket.findUnique({
            where: { id },
            include: {
                client: true,
                support: true,
                messages: true,
            },
        });
    },

    async updateStatus(id, status) {
        return prisma.ticket.update({
            where: { id },
            data: { status },
        });
    },
};