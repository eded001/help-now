const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, 'prisma');
const outputFile = path.join(prismaDir, 'schema.prisma');

const files = [
    'enums/Roles.enum.prisma',
    'enums/TicketCategory.enum.prisma',
    'enums/TicketPriority.enum.prisma',
    'enums/TicketStatus.enum.prisma',
    'models/User.model.prisma',
    'models/Ticket.model.prisma',
];

const dataSourceAndGenerator = `
// --- data source ---
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// --- generator ---
generator client {
  provider = "prisma-client-js"
}
`;

let schemaContent = dataSourceAndGenerator + '\n';

for (const file of files) {
    const filePath = path.join(prismaDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        schemaContent += `// --- ${file} ---\n`;
        schemaContent += content + '\n\n';
    } else {
        console.warn(`Arquivo não encontrado: ${filePath}`);
    }
}

fs.writeFileSync(outputFile, schemaContent.trim());
console.log(`Arquivo schema.prisma gerado com sucesso!`);