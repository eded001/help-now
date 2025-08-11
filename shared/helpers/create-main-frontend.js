const writeFile = require('../utils/file.util').writeFile;
const getIP = require('../utils/ip.util').getLocalIPv4;

module.exports =
    async function createMainFile() {
        console.log("Criando arquivo main.js no frontend...");

        const envInfos = {
            ip: getIP(),
            port: 5500
        };

        // Geração do export de env
        const envExport = `export const env = {
    ip: "${envInfos.ip}",
    port: "${envInfos.port}"
};`;

        // Carrega dados do JSON
        const options = require('../constants/options.json');

        // Separação em dois exports
        const departmentsExport = `export const departments = ${JSON.stringify(options.departments, null, 4)};`;
        const problemsExport = `export const problems = ${JSON.stringify(options.problems, null, 4)};`;

        // Junta o conteúdo final
        const content = `${envExport}\n\n${departmentsExport}\n\n${problemsExport}`;

        try {
            await writeFile('../../frontend/public/scripts', 'main.js', content);
            console.log('Arquivo main.js criado com sucesso!\n');
        } catch (error) {
            console.error(`Erro ao criar arquivo main.js: ${error.message}`);
        }
    }