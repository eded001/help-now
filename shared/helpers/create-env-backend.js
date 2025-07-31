const writeFile = require('../utils/file.util').writeFile;
const getIP = require('../utils/ip.util').getLocalIPv4;

module.exports = {
    async createEnvBackend() {
        console.log("Criando arquivo .env no backend...");

        try {
            const ip = getIP();
            const ports = {
                server: 5500,
                websocket: 5515,
                api: 5525
            }

            const content = `# environment variables

## IP address
IP=${ip}

## Ports
PORT=${ports.server}
WEBSOCKET_PORT=${ports.websocket}
API_PORT=${ports.api}

# db
DATABASE_URL="file:../db/database.sqlite"`;

            await writeFile('../../../backend/', '.env', content);

            console.log('Arquivo .env criado com sucesso!\n');
        } catch (error) {
            console.error(`Erro ao criar arquivo .env: ${error.message}`);
        }
    }
}

module.exports.createEnvBackend;