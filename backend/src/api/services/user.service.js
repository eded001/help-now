const prisma = require('../../../prisma/client');

// criar usuário
async function create({ username, name, password, department, role = 'CLIENT' }) {
    return prisma.user.create({
        data: {
            username,
            name,
            password,
            department,
            role
        },
        select: {
            id: true,
            name: true,
            username: true,
            department: true,
            role: true,
            created_at: true
        }
    });
}

// encontrar usuário por nome
async function findByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
}

// compara senha
async function verifyPassword(plainPassword, storedPassword) {
    return plainPassword === storedPassword;
}

module.exports = { create, findByUsername, verifyPassword };