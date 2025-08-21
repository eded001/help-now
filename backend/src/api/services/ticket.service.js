const prisma = require('../../../prisma/client');

// cria um ticket
async function create(ticketData) {
    return prisma.ticket.create({
        data: ticketData,
        include: {
            created_by: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    department: true,
                    role: true
                }
            }
        }
    });
}

// lista os tickets
async function getAll() {
    return prisma.ticket.findMany({
        include: {
            created_by: {
                select: { id: true, username: true, name: true }
            },
            assigned_to: {
                select: { id: true, username: true, name: true }
            }
        },
        orderBy: { created_at: 'desc' }
    });
}

// retorna o ticket por ID
async function getById(id) {
    return prisma.ticket.findUnique({
        where: { id },
        include: {
            created_by: {
                select: { id: true, username: true, name: true }
            },
            assigned_to: {
                select: { id: true, username: true, name: true }
            }
        }
    });
}

// atualiza um ticket
async function update(id, updates) {
    return prisma.ticket.update({
        where: { id },
        data: updates,
        include: {
            created_by: {
                select: { id: true, username: true, name: true }
            },
            assigned_to: {
                select: { id: true, username: true, name: true }
            }
        }
    });
}

// apaga um ticket
async function deleteTicket(id) {
    return prisma.ticket.delete({ where: { id } });
}

module.exports = { create, getAll, getById, update, deleteTicket };
