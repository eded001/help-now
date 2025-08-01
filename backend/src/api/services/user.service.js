const prisma = require('../../../prisma/client');

module.exports = {
    async create({ username, name, password, role = 'CLIENT' }) {
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
            },
        });
    },

    async findByUsername(username) {
        return prisma.user.findUnique({ where: { username } });
    },

    // compara senha
    async verifyPassword(plainPassword, storedPassword) {
        return plainPassword === storedPassword;
    },
};