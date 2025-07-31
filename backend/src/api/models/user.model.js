const prisma = require('../../../prisma/client/client');

module.exports = {
    // cria usuário armazenando a senha como está (não recomendado em produção)
    async create({ username, password, role = 'CLIENT' }) {
        return prisma.user.create({
            data: {
                username,
                password,
                role,
            },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    // busca usuário pelo username, incluindo a senha para verificação
    async findByUsername(username) {
        return prisma.user.findUnique({
            where: { username },
        });
    },

    // compara senha
    async verifyPassword(plainPassword, storedPassword) {
        return plainPassword === storedPassword;
    },
};