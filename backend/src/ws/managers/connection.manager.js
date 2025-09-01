const clients = new Map();   // clientId -> socket
const supports = new Map();  // supportId -> socket

function registerConnection(socket, type, id, username) {
    const connectionData = { socket, username };

    if (type === 'client') {
        clients.set(id, connectionData);
    } else if (type === 'support') {
        supports.set(id, connectionData);
    }
}

function removeConnection(socket) {
    if (socket.userType === 'client') clients.delete(socket.userId);
    if (socket.userType === 'support') supports.delete(socket.userId);
}

function broadcastToSupports(message) {
    const msg = JSON.stringify(message);
    supports.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) socket.send(msg);
    });
}

module.exports = { registerConnection, removeConnection, broadcastToSupports, clients, supports };