const writeFile = require('../utils/file.util').writeFile;
const getIP = require('../utils/ip.util').getLocalIPv4;

module.exports = {
    async createEnvBackend() {
        console.log("Criando arquivo .env no backend...");

        try {
            const ip = getIP(); // pega o IP local dinamicamente
            const port = 5500;  // valor fixo

            const content = `# environment variables

## Address
IP=${ip}
PORT=${port}

# db
DATABASE_URL="file:../db/database.sqlite"`;

            await writeFile('../../backend', '.env', content);

            console.log('Arquivo .env criado com sucesso!\n');
        } catch (error) {
            console.error(`Erro ao criar arquivo .env: ${error.message}`);
        }
    }
}