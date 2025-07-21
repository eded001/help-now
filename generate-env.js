const os = require('os');
const fs = require('fs');
const path = require('path');

const interfaces = os.networkInterfaces();
let ip = null;

const PORTS = {
    HOST_PORT: 5510 || process.argv[0],
    HOST_WEBSOCKET_PORT: 5515 || process.argv[1],
    CLIENT_PORT: 5520 || process.argv[2]
};

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
IP = ${ip}

# host ports
HOST_PORT=${PORTS.HOST_PORT}
HOST_WEBSOCKET_PORT=${PORTS.HOST_WEBSOCKET_PORT}

# client port
CLIENT_PORT=${PORTS.CLIENT_PORT}`;

fs.writeFileSync(path.join(__dirname, './', '.env'), envContent);

const configContent = `window.env = {
    ip: "${ip}",
    webSocketPort: "${PORTS.HOST_WEBSOCKET_PORT}"
};`;

fs.writeFileSync(path.join(__dirname, 'public/js/env/', '.env.js'), configContent);

console.log('.env.js gerado com sucesso!');
console.log('IP: ', ip);
console.log('WebSocket Port: ', PORTS.HOST_WEBSOCKET_PORT);
console.log('Host Port: ', PORTS.HOST_PORT);
console.log('Client Port: ', PORTS.CLIENT_PORT);