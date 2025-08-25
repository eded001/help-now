const clients = new Map();   // clientId -> socket
const supports = new Map();  // supportId -> socket

function registerConnection(socket, type, id) {
    if (type === 'client') clients.set(id, socket);
    if (type === 'support') supports.set(id, socket);

    socket.userType = type;
    socket.userId = id;
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