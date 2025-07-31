const prisma = require('../../../prisma/client');

module.exports = {
    async create({ username, password, role = 'CLIENT' }) {
        const hashedPassword = password;

        return prisma.user.create({
            data: {
                username,
                password: hashedPassword,
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