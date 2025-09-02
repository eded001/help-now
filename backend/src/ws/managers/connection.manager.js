const clients = new Map();   // clientId -> socket
const supports = new Map();  // supportId -> socket

function registerConnection(socket, type, username) {
    const connectionData = { socket, username };

    if (type === 'client') {
        clients.set(username, connectionData);
    } else if (type === 'support') {
        supports.set(username, connectionData);
    }
}

function removeConnection(socket) {
    if (socket.userType === 'client') clients.delete(socket.username);
    if (socket.userType === 'support') supports.delete(socket.username);
}

function broadcastToSupports(message) {
    const msg = JSON.stringify(message);
    supports.forEach(userSockets => {
        userSockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(msg);
            }
        });
    });
}

module.exports = { registerConnection, removeConnection, broadcastToSupports, clients, supports };