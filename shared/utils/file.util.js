const fs = require('fs/promises');
const path = require('path');

async function createDirectoryIfNotExists(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
}

module.exports = {
    async writeFile(dirPath, fileName, content) {
        const filePath = path.join(__dirname, dirPath, fileName);

        try {
            await createDirectoryIfNotExists(dirPath);
            await fs.writeFile(filePath, content, 'utf-8');
        } catch (error) {
            console.error(`Erro ao escrever arquivo: ${error.message}`);
        }
    },

    async readFile(dirPath, fileName) {
        const filePath = path.join(__dirname, dirPath, fileName);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            console.error(`Erro ao ler arquivo: ${error.message}`);
            return null;
        }
    }
};