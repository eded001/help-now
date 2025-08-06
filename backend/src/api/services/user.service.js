const prisma = require('../../../prisma/client');

async function create({ username, name, password, role = 'CLIENT' }) {
    return prisma.user.create({
        data: {
            username,
            name,
            password,
            role,
        },
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
        }
    });
}

async function findByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
}

// compara senha
async function verifyPassword(plainPassword, storedPassword) {
    return plainPassword === storedPassword;
}

module.exports = { create, findByUsername, verifyPassword };