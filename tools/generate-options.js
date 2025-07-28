const fs = require('fs');
const path = require('path');

function generateOptionsFile(jsonPath, outputPath) {
    const jsonRaw = fs.readFileSync(jsonPath, 'utf-8');
    const jsonData = JSON.parse(jsonRaw);

    const { options = {}, problems = {} } = jsonData;

    const objToString = obj =>
        Object.entries(obj)
            .map(([key, val]) => {
                const keyFormatted = /^[a-zA-Z0-9_]+$/.test(key) ? key : `'${key}'`;
                const valFormatted = typeof val === 'string' ? val.trim() : val;
                return `    ${keyFormatted}: ${JSON.stringify(valFormatted)}`;
            })
            .join(',\n');

    const optionsUseStr = `const optionsUse = {\n${objToString(options)}\n};\n\n`;
    const optionsProblemsStr = `const optionsProblems = {\n${objToString(problems)}\n};\n\n`;
    const exportStr = 'export { optionsUse, optionsProblems };';

    const finalFile = optionsUseStr + optionsProblemsStr + exportStr;

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(outputPath, finalFile, 'utf-8');
    console.log(`Arquivo ${outputPath} criado com sucesso!`);
}

generateOptionsFile(
    path.resolve(__dirname, '../options.json'),
    path.resolve(__dirname, '../public/js/utils/options.js')
);