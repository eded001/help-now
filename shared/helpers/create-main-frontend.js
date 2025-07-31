const file = require('../utils/file.util');
const getIP = require('../utils/ip.util').getLocalIPv4;

module.exports = {
    async createMainFile() {
        console.log("Criando arquivo main.js no frontend...");

        const envInfos = {
            ip: getIP(),
            ports: {
                server: 5500,
                websocket: 5515,
                api: 5525
            }
        }

        const envContent = `window.env = {
    ip: "${envInfos.ip}",
    port: "${envInfos.ports.server}",
    webSocketPort: "${envInfos.ports.websocket}",
    apiPort: "${envInfos.ports.api}"
}`;

        const optionsContent = `window.allOptions = ${await file.readFile('../constants', 'options.json')}`;

        try {
            const content = `${envContent}\n\n${optionsContent}`;

            await file.writeFile('../../../frontend/scripts', 'main.js', content);

            console.log('Arquivo main.js criado com sucesso!\n');
        } catch (error) {
            console.error(`Erro ao criar arquivo main.js: ${error.message}`);
        }
    }
}

module.exports.createMainFile;