const WebSocket = require('ws');
const { heartbeat } = require('./utils/heartbeat.util');
const { removeConnection } = require('./managers/connection.manager');
const { handleIncomingMessage } = require('./handlers/message.handler');

function createWebSocketServer(server) {
    const wsServer = new WebSocket.Server({ server });

    wsServer.on('connection', socket => {
        socket.isAlive = true;
        socket.on('pong', () => (socket.isAlive = true));

        // Heartbeat
        const interval = setInterval(() => {
            wsServer.clients.forEach(client => heartbeat(client));
        }, 5000);

        socket.on('message', data => handleIncomingMessage(socket, data));

        socket.on('close', () => {
            clearInterval(interval);
            removeConnection(socket);
        });
    });

    console.log("Servidor WebSocket em execução");
    return wsServer;
}

module.exports = createWebSocketServer;