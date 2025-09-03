const WebSocket = require('ws');

const clients = new Map();   // username -> [sockets]
const supports = new Map();  // username -> [sockets]
const sessionToUsername = new Map(); // sessionId -> username

function registerConnection(socket, type, username, sessionId) {
    socket.username = username;
    socket.userType = type;
    socket.sessionId = sessionId;

    const store = type === 'client' ? clients : supports;

    if (!store.has(username)) store.set(username, []);
    store.get(username).push(socket);

    if (sessionId) sessionToUsername.set(sessionId, username);
}

function removeConnection(socket) {
    const store = socket.userType === 'client' ? clients : supports;

    if (!store.has(socket.username)) return;

    const sockets = store.get(socket.username).filter(s => s !== socket);

    if (sockets.length > 0) {
        store.set(socket.username, sockets); // ainda tem conexões ativas
    } else {
        store.delete(socket.username);       // remove usuário totalmente
    }
}

function broadcastToSupports(payload) {
    const msg = JSON.stringify(payload);

    supports.forEach(socketsArray => {
        socketsArray.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(msg);
            }
        });
    });
}

function sendToUser(username, type, payload) {
    const msg = JSON.stringify(payload);
    const store = type === 'client' ? clients : supports;

    if (!store.has(username)) {
        console.warn(`Nenhuma conexão encontrada para ${type} "${username}"`);
        return;
    }

    const sockets = store.get(username);

    sockets.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(msg);
        }
    });
}

function getUsernameBySessionId(sessionId) {
    return sessionToUsername.get(sessionId);
}

module.exports = { registerConnection, removeConnection, broadcastToSupports, sendToUser, getUsernameBySessionId };