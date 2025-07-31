const User = require('./UserModel');

module.exports = {
    async initAdminUser() {
        try {
            const existing = await User.findOne({ where: { username: 'admin' } });

            if (!existing) {
                await User.create({
                    name: 'Administrador',
                    username: 'admin',
                    password: "adm123",
                    type_account: 'admin'
                });

                console.log('Usuário administrador criado!');
            } else {
                console.log('Usuário administrador já existe.');
            }
        } catch (error) {
            console.error('Erro ao inicializar usuário admin: ', error);
        }
    }
}