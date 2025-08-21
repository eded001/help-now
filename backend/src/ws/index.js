const WebSocket = require('ws');
const { heartbeat } = require('./utils');
const { registerConnection, removeConnection } = require('./connectionManager');
const handleMessage = require('./messageHandler');

function createWebSocketServer(server, { ip, port }) {
    const wsServer = new WebSocket.Server({ server });

    wsServer.on('connection', socket => {
        socket.isAlive = true;
        socket.on('pong', () => socket.isAlive = true);

        // heartbeat
        const interval = setInterval(() => {
            wsServer.clients.forEach(client => heartbeat(client));
        }, 5000);

        // evento de mensagem
        socket.on('message', data => handleMessage(socket, data));

        // evento de fechamento
        socket.on('close', () => {
            clearInterval(interval);
            removeConnection(socket);
        });

        registerConnection(socket);
    });

    console.log(`Servidor WebSocket em execução: ws://${ip}:${port}`);
    return wsServer;
}

module.exports = createWebSocketServer;