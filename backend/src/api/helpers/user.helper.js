const prisma = require('../prisma/client');

async function findUserOrThrow(username) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error(`Usuário '${username}' não encontrado`);
    return user;
}

module.exports = { findUserOrThrow };