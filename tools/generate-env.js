const os = require('os');
const fs = require('fs');
const path = require('path');

const interfaces = os.networkInterfaces();
let ip = null;

const PORTS = {
    PORT: process.argv[3] || 5510,
    WEBSOCKET_PORT: process.argv[4] || 5520,
};

// pega o primeiro IPv4 válido (não interno)
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

const envContent = `# main
IP=${ip}
PORT=${PORTS.PORT}

# websocket
WEBSOCKET_PORT=${PORTS.WEBSOCKET_PORT}

# secret key
SECRET_KEY=${require('crypto').randomBytes(64).toString('hex')}`;

const configContent = `window.env = {
    ip: "${ip}",
    port: "${PORTS.PORT}",
    webSocketPort: "${PORTS.WEBSOCKET_PORT}"
};`;

const envDirBackend = path.join(__dirname, '../backend');
const envDirJs = path.join(__dirname, '../public/js/utils');

fs.mkdirSync(envDirBackend, { recursive: true });
fs.mkdirSync(envDirJs, { recursive: true });

fs.writeFileSync(path.join(envDirBackend, '.env'), envContent);
fs.writeFileSync(path.join(envDirJs, 'env.js'), configContent);

console.log('.env criado com sucesso no backend!');
console.log('env.js criado com sucesso no frontend!');
console.log('IP usado: ', ip);
console.log('Porta usada: ', PORTS.PORT);
console.log('WebSocket Port: ', PORTS.WEBSOCKET_PORT);