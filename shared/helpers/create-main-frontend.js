// TODO: adaptar o window.env para o novo modelo criado
// ou
// TODO: substituir pelo Vite
/*
const env = {
    ip: "192.168.100.11",
    port: "5500"
};

const allOptions = {
    options: {
        "Agendamentos": "Agendamentos",
        "Contato": "Contato",
        "Contratos": "Contratos",
        "Controle Interno": "Controle Interno",
        "Comunicação": "Comunicação",
        "DAF": "DAF (Administração Financeira)",
        "DEAC": "DEAC (Cultura)",
        "DPH": "DPH (Patrimônio Histórico)",
        "Gabinete": "Gabinete",
        "Jurídico": "Jurídico",
        "Materiais": "Materiais",
        "Planejamento": "Planejamento",
        "Protocolo": "Protocolo",
        "RH": "RH (Recursos Humanos)",
        "Sincronizado": "Sincronizado",
        "Serviços Gerais": "Serviços Gerais",
        "Superintendência": "Superintendência",
        "Turismo": "Turismo"
    },
    problems: {
        "activation-recurse": "Ativação de recurso",
        "bug": "Bug",
        "sharing-recurse": "Compartilhamento de recurso",
        "technical": "Técnico"
    }
};

export { env, allOptions };
 */

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