const prisma = require('../../../prisma/client');

const AuthService = {
    async register({ name, username, department, password }) {
        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {
            throw new Error("Já existe um usuário com este username");
        }

        const user = await prisma.user.create({
            data: {
                name,
                username,
                department,
                password // plain text apenas para teste
            }
        });

        return user;
    },

    async login({ username, password }) {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || user.password !== password) {
            throw new Error('Credenciais inválidas');
        }

        return user;
    },

    async updatePassword({ username, password }) {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const updatedUser = await prisma.user.update({
            where: { username },
            data: { password }
        });

        return updatedUser;
    }
};

module.exports = AuthService;