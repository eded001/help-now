const os = require('os');
const fs = require('fs');
const path = require('path');

const interfaces = os.networkInterfaces();
let ip = null;

const PORTS = {
    HOST_PORT: process.argv[2] || 5510,
    HOST_WEBSOCKET_PORT: process.argv[3] || 5515,
    CLIENT_PORT: process.argv[4] || 5520,
    API_PORT: process.argv[5] || 5525,
};

// Pega o primeiro IPv4 válido (não interno)
for (const name in interfaces) {
    for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
            ip = iface.address;
            break;
        }
    }
    if (ip) break;
}

if (!ip) {
    console.error('Não foi possível obter o IPv4 da máquina.');
    process.exit(1);
}

// Conteúdo do .env (para o backend)
const envContent = `# main
IP=${ip}

# api port
API_PORT=${PORTS.API_PORT}

# host ports
HOST_PORT=${PORTS.HOST_PORT}
HOST_WEBSOCKET_PORT=${PORTS.HOST_WEBSOCKET_PORT}

# client port
CLIENT_PORT=${PORTS.CLIENT_PORT}
`;

// Conteúdo do env.js (para o frontend)
const configContent = `window.env = {
    ip: "${ip}",
    webSocketPort: "${PORTS.HOST_WEBSOCKET_PORT}",
    apiPort: "${PORTS.API_PORT}"
};`;

// Caminhos
const envDirBackend = path.join(__dirname, '../backend');
const envDirJs = path.join(__dirname, '../public/js/utils');

// Criação dos diretórios se não existirem
fs.mkdirSync(envDirBackend, { recursive: true });
fs.mkdirSync(envDirJs, { recursive: true });

// Escrita dos arquivos
fs.writeFileSync(path.join(envDirBackend, '.env'), envContent);
fs.writeFileSync(path.join(envDirJs, 'env.js'), configContent);

// Logs de confirmação
console.log('.env criado com sucesso no backend!');
console.log('env.js criado com sucesso no frontend!');
console.log('IP usado: ', ip);
console.log('WebSocket Port: ', PORTS.HOST_WEBSOCKET_PORT);
console.log('Host Port: ', PORTS.HOST_PORT);
console.log('Client Port: ', PORTS.CLIENT_PORT);
console.log('API Port: ', PORTS.API_PORT);