const prisma = require('../../../prisma/client');

const UserService = {
    async createUser({ name, username, department, password }) {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            throw new Error("Usuário já existe");
        }

        const user = await prisma.user.create({
            data: { name, username, department, password }
        });

        return user;
    },

    async getAllUsers() {
        return await prisma.user.findMany();
    },

    async getUserById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new Error("Usuário não encontrado");
        return user;
    },

    async updateUser(id, data) {
        return await prisma.user.update({ where: { id }, data });
    },

    async deleteUser(id) {
        return await prisma.user.delete({ where: { id } });
    }
};

module.exports = UserService;